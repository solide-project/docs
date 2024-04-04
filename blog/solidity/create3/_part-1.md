## What is Create3

With the advancement of multichain development, **CREATE3** emerges as a transformative and cheap alternative to the deployment of smart contracts. With the existing Solidity opcodes such as `create` and `create2`, the Create3 is built upon the solidity of `create2` to grant developers control over contract deployment. By enabling developers to predetermine contract addresses before deployment, CREATE3 imbues them with a newfound sense of agency. This new approach not only enhances control but also fosters consistency and uniformity across Ethereum Virtual Machine (EVM) blockchains, allowing for the synchronization of smart contract ecosystems. Whether navigating the Ethereum mainnet, testnets, or private networks, CREATE3 facilitates the harmonious deployment of contracts with identical addresses, thereby heralding a new era of streamlined blockchain development.

## Solmate CREATE3

For a more technical perspective, let's dive into Solmate's CREATE3 library, which is designed for deploying smart contracts to deterministic addresses without necessitating an initcode factor. The CREATE3 `deploy` method operates by leveraging `create2` initially to deploy a CREATE factory, with its nonce set to 1 which then is used to deploy the desired derived contract.


Another important part is the Proxy Bytecode. 

```solidity
bytes internal constant PROXY_BYTECODE = hex"67_36_3d_3d_37_36_3d_34_f0_3d_52_60_08_60_18_f3";
```
The proxy bytecode essentially acts as an intermediary contract that executes the `create` opcode within its context. By deploying this proxy contract with a unique salt value and having it call "create" with its current nonce (starting at 1 upon first use), the contract bytecode itself becomes independent of the address derivation process. This means that the address of the deployed contract is determined solely by the creator's address, the salt value, and the hash of the proxy bytecode, without being influenced by the specific bytecode of the contract being deployed. This is what makes the contracts deterministic and predictable in their deployments, and how developers can ensure resulting contract addresses deployed on other networks are consistent.


Then we deploy this proxy contract as a new contract using the `create2` opcode. The create2 opcode will take in the *ether value* which is defined as `0`, the *bytecode of the proxy contract* and offset by 32 bytes to skip the first 32 bytes which represent the length of the bytecode, then the *bytecode loaded from memory* and the *salt* used for deterministic address derivation.

```solidity
deployed = getDeployed(salt);
(bool success, ) = proxy.call{value: value}(creationCode);
```
Following that the `getDeployed` function is called to retrieve the address of the deployed contract based on the provided salt value. Subsequently, the proxy contract is invoked with the `creationCode` to initialize the deployed contract.

There are also two required checks, 
```solidity
require(proxy != address(0), "DEPLOYMENT_FAILED");
require(success && deployed.code.length != 0, "INITIALIZATION_FAILED");
```
- The first statement ensures that the deployment was successful by checking that the proxy address is not zero.
- the second statement verifies that the initialization was successful and that the deployed contract's bytecode is not empty.


So in general the steps to deploying a smart contract using create3 is, 
- creating a Factory contract (`Deployer.sol`) 
- calls `create3.deploy`
  - calls `create2` to create a proxy contract
  - the proxy contract will be called 
  - `create` from the proxy contract to create the **contract**

## Looking at the Deployer Example contract

The `Deployer.sol` contract is essentially a **factory contract** that deploys the contract bytecode to a deterministic address. The contract has a `deploy` method that takes in the salt value and can take the bytecode of the contract to be deployed. In a more generic sense, you can pass any bytecode in so the `deployer()` method can be,

```solidity
function deploy(bytes memory _salt, bytes memory _bytecode, /* more args for constructor */) external {
    bytes memory bc = abi.encodePacked(
        _bytecode,
        abi.encode(msg.sender)
        // args, 
    );

    CREATE3.deploy(keccak256(_salt), bc, _value);
}
```

For this contract, we've encapsulated the deployment of a contract identified as `Ownerable.sol`. Utilizing the built-in methods, we extract the bytecode of `Ownerable` and subsequently invoke the `create3.deploy` function from the Solmate library. This invocation passes along the salt, the extracted bytecode, and any specified ether value as parameters. The `create3.deploy` function is then responsible for deploying the contract using the provided bytecode.

## Deploy using CREATE3

*It is important to note the given example using CREATE3 on multichain with the same address, you **MUST** use a wallet with the same nonce on each network. The best solution is to create an entirely new wallet and send some funds on each chain.*

For our demonstration, we'll deploy contracts on the *BASE Sepolia* and *Polygon Mumbai* testnet. Begin by compiling and deploying `Deployer.sol`. This action will advance the nonce of your wallet by one once the transaction is completed. Following this, switch your Metamask to the Mumbai testnet and deploy using the same newly created wallet. The outcome should be consistent across both networks. It's important to note that the `Deployer.sol` used in both instances is identical, ensuring uniformity in the deployment process.

The examples of deployers on both networks are as follows,
- [Base: 0xfeB362F2148F1303ea6Bf026d32071EA295e25ac](https://sepolia.basescan.org/address/0xfeB362F2148F1303ea6Bf026d32071EA295e25ac)
- [Mumbai: 0xfeB362F2148F1303ea6Bf026d32071EA295e25ac](https://mumbai.polygonscan.com/address/0xfeB362F2148F1303ea6Bf026d32071EA295e25ac)

With CREATE3, we gain the flexibility to selectively target a specific address for contract deployment by using *a salt*. For simplicity, let's use the address `0xfeB362F2148F1303ea6Bf026d32071EA295e25ac` as the salt. The Deployer contract includes a function named `getDeployer`, which, as mentioned, calculates the contract address using the provided salt. Although initially, no contract is deployed at this address, the `getDeployer` can compute the output `Ownerable` address for the contract wallet specified with a salt. This approach ensures that the derived address serves as the deployment target for the contract's implementation in bytecode. Importantly, this guarantees that the address will be consistent across different chains, assuming the deploying wallet's nonce remains the same. We should keep the output address in mind, as it'll be the one we can compare across when using `deploy`.

To deploy with the CREATE3, the Deployer wrapped the `deploy` from create3 and hence we can pass the the `_salt` as whatever byte we want say, `0xfeB362F2148F1303ea6Bf026d32071EA295e25ac`. After a successful deployment, you can verify the contract on a block explorer by checking out the transaction. 