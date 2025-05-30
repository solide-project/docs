## :wrench: _executeUserOp
```solidity
function _executeUserOp(uint256 opIndex, UserOperation calldata userOp, UserOpInfo memory opInfo) 
    private returns (uint256 collected)
```

```solidity
bytes memory context = getMemoryBytesFromOffset(opInfo.contextOffset);
```

The code begins by retrieving the context from memory. The context is stored as a byte array and contains essential information needed for the `Paymaster.postOp` function.

```solidity
try this.innerHandleOp(userOp.callData, opInfo, context) returns (
    uint256 _actualGasCost
) {
    collected = _actualGasCost;
}
```

The code then attempts to execute the UserOperation by invoking the `innerHandleOp` function. This function, implemented by the Paymaster, takes `userOp.callData`, `opInfo`, and `context` as parameters. Upon invocation, `innerHandleOp` returns the actual gas cost incurred by the operation, which is subsequently added to the `collected` variable. 

Go to implementation information for [innerHandleOp](#innerhandleop)

### innerHandleOp

```solidity
function innerHandleOp(
    bytes memory callData,
    UserOpInfo memory opInfo,
    bytes calldata context
) external returns (uint256 actualGasCost)
```

The `innerHandleOp` method is invoked to execute the `UserOperation` calldata on the wallet contract. Leveraging the `Exec` solidity library, available in `util/Exec.sol`, developers gain access to a range of utility functions designed for diverse contract calls. These include regular *call*, *staticcall*, and *delegatecall* functionalities, along with features for retrieving return data and reverting with explicit byte arrays. Such capabilities empower developers to interact flexibly and efficiently with other contracts directly within Solidity contracts, seamlessly managing value transfers and data retrieval. In the following code snippet, `Exec.call` is utilized—a low-level call function—utilizing the calldata provided by `userOp.callData`.

```solidity
if (callData.length > 0) {
    bool success = Exec.call(mUserOp.sender, 0, callData, callGasLimit);
    if (!success) {
        bytes memory result = Exec.getReturnData(REVERT_REASON_MAX_LEN);
        if (result.length > 0) {
            emit UserOperationRevertReason(opInfo.userOpHash, mUserOp.sender, mUserOp.nonce, result);
        }
        mode = IPaymaster.PostOpMode.opReverted;
    }
}
```

```solidity
unchecked {
    uint256 actualGas = preGas - gasleft() + opInfo.preOpGas;
    //note: opIndex is ignored (relevant only if mode==postOpReverted, which is only possible outside of innerHandleOp)
    return _handlePostOp(0, mode, opInfo, context, actualGas);
}
```

Go to implementation information for [_handlePostOp](#_handlepostop)

### _handlePostOp

```solidity
function _handlePostOp(uint256 opIndex, IPaymaster.PostOpMode mode, UserOpInfo memory opInfo, bytes memory context, 
    uint256 actualGas) private returns (uint256 actualGasCost) 
```

```solidity
address refundAddress;
MemoryUserOp memory mUserOp = opInfo.mUserOp;
uint256 gasPrice = getUserOpGasPrice(mUserOp);

address paymaster = mUserOp.paymaster;
if (paymaster == address(0)) {
    refundAddress = mUserOp.sender;
} else {
    refundAddress = paymaster;
    // ...
}
```

When a paymaster is specified and its validation results in a non-empty context, the surplus amount is reimbursed to the account or paymaster, depending on its involvement in the transaction request. As mentioned, the following code executes the `IPaymaster`'s `postOp` function, which is another essential method similar to `validatePaymasterUserOp`.

*The `postOp()` function acts as a post-execution hook after completing a user operation. It manages tasks to be executed upon successful validation of the user operation, such as handling custom token payments for transaction fees. For example, if a user chooses to pay with an ERC-20 token, the entry point invokes `postOp()` after executing the operation and provides information about gas consumption. Importantly, access to `postOp()` is contingent upon the validation context generated by `validatePaymasterUserOp()` not being null. This mechanism simplifies the process of managing token payments and facilitates smooth transaction processing on the blockchain.*

```solidity
if (context.length > 0) {
    actualGasCost = actualGas * gasPrice;
    if (mode != IPaymaster.PostOpMode.postOpReverted) {
        IPaymaster(paymaster).postOp{gas : mUserOp.verificationGasLimit}(mode, context, actualGasCost);
    } else {
        // solhint-disable-next-line no-empty-blocks
        try IPaymaster(paymaster).postOp{gas : mUserOp.verificationGasLimit}(mode, context, actualGasCost) {}
        catch Error(string memory reason) {
            revert FailedOp(opIndex, string.concat("AA50 postOp reverted: ", reason));
        }
        catch {
            revert FailedOp(opIndex, "AA50 postOp revert");
        }
    }
}
```

```solidity
actualGas += preGas - gasleft();
actualGasCost = actualGas * gasPrice;
if (opInfo.prefund < actualGasCost) {
    revert FailedOp(opIndex, "AA51 prefund below actualGasCost");
}
uint256 refund = opInfo.prefund - actualGasCost;
_incrementDeposit(refundAddress, refund);
bool success = mode == IPaymaster.PostOpMode.opSucceeded;
emit UserOperationEvent(opInfo.userOpHash, mUserOp.sender, mUserOp.paymaster, mUserOp.nonce, success, actualGasCost, actualGas);
```

After determining the refund address and ensuring that the paymaster context isn't empty, the code proceeds to calculate the actual gas usage and its associated cost during the execution of a smart contract operation. It then verifies whether the pre-funded amount is adequate to cover the gas cost. If not, the transaction is reverted. Any excess pre-funded amount is calculated as a refund and subsequently added to the deposit of the specified address. Finally, the success status of the operation is determined based on the paymaster's mode setting.

Additionally:
- The `_incrementDeposit` function in the `StakeManager` contract is invoked to increase the paymaster's deposit by the actual gas cost.
- The `actualGasCost = actualGas * gasPrice` calculation determines the actual gas cost of the operation, which is stored as the value of `collected` in the `handleOps` function.

Go back to [handleOps](#point_right-handleops)

## :dollar: _compensate

```solidity
/**
 * compensate the caller's beneficiary address with the collected fees of all UserOperations.
 * @param beneficiary the address to receive the fees
 * @param amount amount to transfer.
 */
function _compensate(address payable beneficiary, uint256 amount) internal {
    require(beneficiary != address(0), "AA90 invalid beneficiary");
    (bool success,) = beneficiary.call{value : amount}("");
    require(success, "AA91 failed send to beneficiary");
}
```

The final step is to compensate the beneficiary with the collected fees. The collected fees are transferred to the beneficiary address. The beneficiary address can be any address where the bundler wants to receive the refund as provided in the `handleOps`.

## Conclusion

In conclusion, the EntryPoint efficiently executes the bundled UserOperations and ensures fair compensation for the beneficiary by collecting fees. This is the flow of `handleOp`. There is also `handleAggregatorOp`. Note also the EntryPoint extends `StakeManger` found in `core/StakeManger.sol` which as mentioned is responsible for managing `deposits` and stakes to ensure reimbursement for beneficiaries during the execution of handleOps and handleAggregatedOps functions. Deposits represent balances used to cover the costs of UserOperations, while stakes are values locked for a specified duration by paymasters, crucial for the reputation system.  To learn more about the EIP proposal and its specifications, you can refer to the official document [here](https://eips.ethereum.org/EIPS/eip-4337).