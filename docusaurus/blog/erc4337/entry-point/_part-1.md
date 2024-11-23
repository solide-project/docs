## Basic

Before we go into the details of the EntryPoint, we need to understand the basic flow of how the EntryPoint works. The EntryPoint is a smart contract that is used to execute `UserOperations`. The `UserOperation` is a struct that contains all the necessary information to execute a transaction. The EntryPoint is used to execute multiple UserOperations at once. This is done to save gas costs and to make the execution of transactions more efficient.

### UserOperation

The primary data structure for user interaction within the Account Abstraction framework is encapsulated in `interfaces/UserOperation.sol`. This structure is typically created by the Bundler and transmitted to the EntryPoint contract. The `UserOperation` struct comprises the following fields:

```solidity
struct UserOperation {
    address sender;
    uint256 nonce;
    bytes initCode;
    bytes callData;
    uint256 callGasLimit;
    uint256 verificationGasLimit;
    uint256 preVerificationGas;
    uint256 maxFeePerGas;
    uint256 maxPriorityFeePerGas;
    bytes paymasterAndData;
    bytes signature;
}
```

An example of a `UserOperation` is provided below:

```typescript
const emptyUserOp: UserOperation = {
    sender: AddressZero,
    callData: '0x',
    nonce: 0,
    preVerificationGas: 0,
    verificationGasLimit: 100000,
    callGasLimit: 0,
    maxFeePerGas: 0,
    maxPriorityFeePerGas: 0,
    signature: '0x'
}
```

In contrast to the traditional approach of sending signed transactions to a mempool for validation, the initial step in ERC-4337 involves dispatching an operation in the form of a **UserOperation**. These operations are then forwarded to an alternative mempool. Users have the capability to dispatch multiple UserOperations concurrently through a Bundler smart contract, referred to as Bundler Transactions.

### Entry Point Contract on Ethereum

The **EntryPoint** (EP) contract on Ethereum, found at [0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789](https://etherscan.io/address/0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789), is crucial for handling `bundlerTransactions`.

You can explore this contract using Solidity's IDE `${SOLIDE_URL}/1/0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789)`

As of writing this, its contract version is `0.6.0` and serves as the main hub for processing batches of `UserOperations`. The contract offers two main methods: `handleOps` and `handleAggregatedOps`. We'll focus on `handleOps` for now, leaving `handleAggregatedOps` for later discussion.

## :point_right: handleOps

The main flow of using the EntryPoint typically comes from the `Bundler` contracts which are called the `handleOps()`

```solidity
function handleOps(UserOperation[] calldata ops, address payable beneficiary) public nonReentrant
```

1. **Non-Reentrant Modifier**: This modifier prevents reentrancy attacks, ensuring the security of the smart contract.
2. **UserOperation Array**: The `ops` array consists of `UserOperation` objects, stored in `calldata`. These objects hold data passed to the contract's entry point.
3. **Beneficiary Address**: The `beneficiary` address is where gas refunds are sent after execution. Typically, this address corresponds to the bundler, but it can be set to any desired address.

```solidity
uint256 opslen = ops.length;
UserOpInfo[] memory opInfos = new UserOpInfo[](opslen);
```

Before executing the UserOperations, the EntryPoint will validate each UserOperation. It'll create a `UserOpInfo` array to store the information of each UserOperation. 

```solidity
for (uint256 i = 0; i < opslen; i++) {
	UserOpInfo memory opInfo = opInfos[i];
	(uint256 validationData, uint256 pmValidationData) = _validatePrepayment(i, ops[i], opInfo);
	_validateAccountAndPaymasterValidationData(i, validationData, pmValidationData, address(0));
}
```

In order to populate the opInfos from the Bundler, the function will undergo validation check in its loops. In order to save gas it'll be in the `uncheck` 

Go to implementation information for [_validatePrepayment](#heavy_check_mark-_validateprepayment)

After the validation of both the Account and Paymaster, the validation is checked to see if they expire in `_validateAccountAndPaymasterValidationData`. If the validation is successful, the EntryPoint will execute the UserOperations. 

Go to implementation information for [_validateAccountAndPaymasterValidationData](#heavy_check_mark-validateaccountandpaymastervalidationdata)

```solidity
uint256 collected = 0;
emit BeforeExecution();

for (uint256 i = 0; i < opslen; i++) {
    collected += _executeUserOp(i, ops[i], opInfos[i]);
}

_compensate(beneficiary, collected);
```

With all validation complete it'll emit an event before execution begins. Then start iterating through each user operation, executing them and adding the gas fees consumed by each operation to the total collected amount. After all operations are executed, it compensates the specified beneficiary with the total collected gas fees, transferring them to the beneficiary's address.

Go to implementation information for [_executeUserOp](#wrench-_executeuserop)

Go to implementation information for [_compensate](#dollar-_compensate)

## :heavy_check_mark: _validatePrepayment

```solidity
function _validatePrepayment(uint256 opIndex, UserOperation calldata userOp, UserOpInfo memory outOpInfo)
	private returns (uint256 validationData, uint256 paymasterValidationData)
```

The `_validatePrepayment` function serves a pivotal role in upholding the integrity and safety of UserOperations within the account abstraction framework.

It takes in three parameters:
- `opIndex`: The index of the operation.
- `userOp`: The UserOperation data structure containing essential information about the operation.
- `outOpInfo`: A UserOpInfo structure used for storing operation-specific data during validation.

```solidity
uint256 preGas = gasleft();
MemoryUserOp memory mUserOp = outOpInfo.mUserOp;
_copyUserOpToMemory(userOp, mUserOp);
outOpInfo.userOpHash = getUserOpHash(userOp);
```

Initially, the function tracks the remaining gas at the start of its execution. Utilizing the built-in Solidity function `gasleft()`, it determines the amount of gas remaining within the current Ethereum transaction. *Throughout the call to the EntryPoint, `gasleft` is employed to inform decisions based on the gas supplied by the Bundler.* Subsequently, it creates a copy of the data from `userOp` into memory for efficient processing. Following this, it calculates a hash of the UserOperation data using the `getUserOpHash` function. This hash functions as a unique identifier for the operation, facilitating validation processes.

```solidity
require(maxGasValues <= type(uint120).max, "AA94 gas values overflow");
```

This line of code ensures that certain numeric values within the UserOperation data, such as gas limits, do not exceed the maximum value representable by a 120-bit unsigned integer. This safeguard is implemented to mitigate the risk of overflow during subsequent calculations.

```solidity
uint256 gasUsedByValidateAccountPrepayment;
(uint256 requiredPreFund) = _getRequiredPrefund(mUserOp);
(gasUsedByValidateAccountPrepayment, validationData) = _validateAccountPrepayment(opIndex, userOp, outOpInfo, requiredPreFund);
```

The function continues by calculating the gas needed to pre-fund the operation. This calculation is based on the UserOperation data and specific conditions defined within the `_getRequiredPrefund` function. Furthermore, the function conducts validation checks using `_validateAccountPrepayment`. These checks ensure that the account *(Smart Contract Wallet)*, possesses adequate funds and allowances to cover the operation's gas costs.

Go to implementation information for [_validateAccountPrepayment](#_validateaccountprepayment)

```solidity
if (mUserOp.paymaster != address(0)) {
	(context, paymasterValidationData) = _validatePaymasterPrepayment(opIndex, userOp, outOpInfo, requiredPreFund, gasUsedByValidateAccountPrepayment);
}
```

This next stage is optional, contingent upon the bundler's inclusion of a paymaster for the UserOperation. *The paymaster is an integral component in Account Abstraction as it enables users to settle transaction fees such as utilizing ERC-20 tokens rather than native tokens like ETH. Acting as an intermediary, the Paymaster gathers ERC-20 tokens from users and remits ETH to the blockchain for transaction facilitation.* Therefore, this aspect is a crucial addition to the EntryPoint, permitting the Bundler to cover the UserOperation costs using ERC-20 tokens instead of native tokens such as ETH.

Go to implementation information for [_validatePaymasterPrepayment](#_validatepaymasterprepayment)


```solidity
uint256 gasUsed = preGas - gasleft();

if (userOp.verificationGasLimit < gasUsed) {
revert FailedOp(opIndex, "AA40 over verificationGasLimit");
}
outOpInfo.prefund = requiredPreFund;
outOpInfo.contextOffset = getOffsetOfMemoryBytes(context);
outOpInfo.preOpGas = preGas - gasleft() + userOp.preVerificationGas;
```

After completing the necessary gas calculations and validations, the function ensures that the gas utilized during validation does not surpass the specified verification gas limit. Upon success, it finalizes the pre-funding details within the `outOpInfo` structure, encompassing the pre-fund amount, memory context offset, and pre-operation gas usage.
- `outOpInfo.prefund` is set to the `requiredPreFund` value, which represents the maximum gas fee deducted from the deposit on EP.
- `outOpInfo.contextOffset` is designated as the offset of the context object in memory. Note that the context object is returned by the `Paymaster.validatePaymasterUserOp` call. By storing only the memory offset of the context object, we alleviate the need to pass around the entire context object while invoking internal methods.
- `outOpInfo.preOpGas` is determined as the sum of the total gas used thus far and the `userOp.preVerificationGas`.

In summary, `_validatePrepayment` assumes the role of guaranteeing the validity and safety of UserOperations within the account abstraction framework. It encompasses crucial tasks such as gas tracking, hashing, validation, and pre-funding calculations, ensuring the seamless and secure execution of operations.

Go back to [handleOps](#point_right-handleops)

### _validateAccountPrepayment

```solidity
_createSenderIfNeeded(opIndex, opInfo, op.initCode);
```

This internal method is crucial for validating the operation with a Smart Contract Wallet (SCW). Initially, it calls upon a Factory contract to create the account if required, utilizing `_createSenderIfNeeded`. The Wallet contract generated by this factory must adhere to `interfaces/IAccount.sol`, which includes the `validateUserOp` function. This function is essential for validating the UserOp's signature, enabling the EntryPoint to execute operations on a Wallet account.

Once the Smart Contract Wallet is deemed valid for further validation, the method proceeds to perform calculations on the gas funds and validate the `validateUserOp` function on the SCW if and only if `paymaster == address(0)`. This condition signifies that the SCW, either passed or generated, will be responsible for covering the current UserOperation execution(s).

**Important stage in handleOps**
At this point, the EntryPoint call stack should `handleOps.validatePrePayment._validateAccountPrepayment`, where the EntryPoint is validating that the SCW has enough gas to cover the UserOperation.

```solidity
try IAccount(sender).validateUserOp{gas : mUserOp.verificationGasLimit}(op, opInfo.userOpHash, missingAccountFunds)
```

*There is also the introduction of reverting the entire transaction if validations fail from the SCW or the call runs out of gas.  Mainly the `FailedOp` will revert the transaction.*

Upon successful validation, both `gasUsedByValidateAccountPrepayment` and `validationData` provided by the SCW through its `IAccount` interface are captured. It is crucial that the validation logic is tailored and executed according to each user's preferences and requirements.

Go back to [_validatePrepayment](#heavy_check_mark-_validateprepayment)

### _validatePaymasterPrepayment


```solidity
uint256 preGas = gasleft();
MemoryUserOp memory mUserOp = opInfo.mUserOp;
address paymaster = mUserOp.paymaster;
DepositInfo storage paymasterInfo = deposits[paymaster];
uint256 deposit = paymasterInfo.deposit;
if (deposit < requiredPreFund) {
    revert FailedOp(opIndex, "AA31 paymaster deposit too low");
}
```
Similarly to the `_validateAccountPrepayment`, this time, it'll check the paymaster's deposit balance in EP. If there is enough despot compared to the provided, it'll deduct the that the the requiredPreFund from the Paymaster's deposit,

```solidity
MemoryUserOp memory mUserOp = opInfo.mUserOp;
uint256 verificationGasLimit = mUserOp.verificationGasLimit;
require(verificationGasLimit > gasUsedByValidateAccountPrepayment, "AA41 too little verificationGas");
uint256 gas = verificationGasLimit - gasUsedByValidateAccountPrepayment;
```

`gasUsedByValidateAccountPrepayment` calculated by the Account validation, is used to calculate the gas required to pay back the bundler. This is done via `_getRequiredPrefund`. Since the EntryPoint is executing the UserOperations, this means that EntryPoint must ensure it has enough gas to execute those UserOperations and in order for the Bundler to obtain the gas, depends on whether a Paymaster is set up or the Smart Contract Wallet provided. 

```solidity
paymasterInfo.deposit = deposit - requiredPreFund
```

After deducting the deposit as mentioned call the validationOp's `validatePaymasterUserOp` for paymaster of `interfaces/IPaymaster.sol` and with the  `userOp.verificationGasLimit` as gas limit and return the validation Data.

```solidity
IPaymaster(paymaster).validatePaymasterUserOp{gas: gas}(op, opInfo.userOpHash, requiredPreFund) returns (bytes memory _context, uint256 _validationData) 
```

This will return *context object* and `validationData`.

Go back to [_validatePrepayment](#heavy_check_mark-_validateprepayment)

## :heavy_check_mark: validateAccountAndPaymasterValidationData

```solidity
function _validateAccountAndPaymasterValidationData(uint256 opIndex, uint256 validationData, uint256 paymasterValidationData,
    address expectedAggregator)
```

`validateAccountAndPaymasterValidationData` serves to validate the validation data from both the Smart Contract Wallet (SCW) and Paymaster. It verifies if the validation data has expired and reverts the transaction if it has. Notably, in the Ethereum EntryPoint, the `address(0)` represents the `expectedAggregator`.

Before unpacking the validationData, An example of validation data is as follows as taken by `account-abstraction/ethereum/contracts/TokenPaymaster.sol`. *Note this is just an example, other Paymaster's or SCW validation will have different validation data depending on it implementation.*

```solidity
validationResult = _packValidationData(
	false,
	uint48(cachedPriceTimestamp + tokenPaymasterConfig.priceMaxAge),
	0
);
```

The validationData comprises three components, which are essential for the EntryPoint to validate the UserOperation,
- Aggregator: This value signifies the success of the aggregator. A value of `0` indicates a successful aggregator. For instance, if `false` is provided, it results in the value `0`, indicating success.
- ValidUntil: This represents the start time when the signature is valid.
- ValidAfter: This denotes the end time when the signature is valid.

These components collectively determine whether signature verification was successful. The primary implementation of parsing the validationData is outlined in `Helper.sol` within the `_parseValidationData` function. In essence, this method extracts the aggregator value (an `address`), the validUntil timestamp (a `uint48`), and the validAfter timestamp (a `uint48`) from the validationData. If the validUntil value is 0, as observed in the example provided, it signifies that the signature is valid until the maximum value of `uint48`.

Since both validationData and paymasterValidationData undergo validation in a similar manner, we'll focus on the paymasterValidationData. The validation process involves comparing these values with the current block timestamp in the EntryPoint to ascertain their validity.

```solidity
address pmAggregator;
(pmAggregator, outOfTimeRange) = _getValidationData(paymasterValidationData);
if (pmAggregator != address(0)) {
	revert FailedOp(opIndex, "AA34 signature error");
}
if (outOfTimeRange) {
	revert FailedOp(opIndex, "AA32 paymaster expired or not due");
}
```

Hence if we go back to the EntryPoint where it'll parse the above `validationResult` as `paymasterValidationData` we see it extracts the `pmAggregator` variable represents the aggregator status obtained from the paymasterValidationData. A value of `0` indicates a successful aggregator, while `1` implies an expired aggregator. With this, if `pmAggregator` is assigned the value of `address(0)`, it signifies that the aggregator is successful as it has the value of `0`.

Furthermore, validation is conducted by comparing the current block timestamp with the validUntil and validAfter timestamps obtained from the validation data. The `outOfTimeRange` variable is set based on whether the current timestamp exceeds the validUntil timestamp or falls before the validAfter timestamp. If `outOfTimeRange` is `true`, it indicates that the paymaster has expired or the operation is not yet due.

```solidity
outOfTimeRange = block.timestamp > data.validUntil || block.timestamp < data.validAfter;
```

In summary, the code snippet checks the status of the aggregator and verifies the validity of the paymaster based on timestamps, ensuring that the operation is executed within the designated time range. If any discrepancy is detected, the function reverts the transaction with an appropriate error message, such as "signature error" or "paymaster expired or not due."

Go back to [handleOps](#point_right-handleops)

### numberMarker()

```solidity
//place the NUMBER opcode in the code.
// this is used as a marker during simulation, as this OP is completely banned from the simulated code of the
// account and paymaster.
function numberMarker() internal view {
    assembly {mstore(0, number())}
}
```

This function is mainly useful for the method `simulateValidation`, for tracing and checkpoints throughout the code. For our purpose, we don't need to really worry about this.