// Should be AbiFunction from 'viem'
type AbiFunction = any;

/**
 * Base interface for submissions, representing a common schema for both deployments and transactions.
 */
export interface Submission {
    /**
     * Optional file path associated with the submission.
     * This could be a location where relevant files (e.g., bytecode or ABI) are stored.
     */
    path?: string;

    /**
     * A unique identifier for the submission.
     * This ID is used to differentiate between various submissions in the system.
     */
    id: string;

    /**
     * The blockchain network identifier where the submission is intended to be deployed.
     * For example, this could be a chain name (e.g., "Ethereum") or chain ID.
     */
    chain: string;

    /**
     * The type of submission, which can be either "deployment" or "transaction".
     * This property determines the specific details required for the submission.
     */
    type: "deployment" | "transaction" | "value" | "data";

    /**
     * An optional description providing additional context about the submission.
     * This can include the purpose, usage, or metadata about the submission.
     */
    description?: string;
}

/**
 * Represents a deployment submission, with additional bytecode information.
 * 
 * Used for quest that requiring deployment a smart contract
 * @category Submission
 * @example
 * This is an of deploying a smart contract to Open Campus testnet. The bytecode property is the hash bytecode of the
 * desire contract from course
 * 
 * ```json
 * {
 *      "path": "01_deploy_your_first_token/05_deploy",
 *      "type": "deployment",
 *      "chain": "656476",
 *      "bytecode": "0x86d1b8039b28cf6e8bfbc8ec91d3e4cda65348f689bdc101b1fe39a9f590dcba"
 * }
 * ```
 * @example
 * 
 *  ```json
 * {
 *      "path": "01_deploy_your_first_token/05_deploy",
 *      "description": "Deploy coin contract on Sui testnet",
 *      "type": "deployment",
 *      "chain": "1282977196",
 *      "bytecode": "0xab1e7fe48a2491a5f6932f8d78b10809f1d70f029a964aa0870daf563748afe7"
 * }
 * ```
 */
export interface Deployment extends Submission {
    /**
     * Indicates that this submission is specifically a deployment.
     * The value is always "deployment" for this interface.
     */
    type: "deployment";

    /**
     * A SHA-256 hash of the deployment's bytecode.
     * This ensures integrity and allows verification of the deployed contract.
     */
    bytecode: string;
}

/**
 * Represents a transaction submission, with ABI and contract details.
 * 
 * Used for quests that require the execution of a smart contract transaction.
 * @category Submission
 * @example
 * This example demonstrates submitting a transaction to invoke a function on a deployed contract.
 * The abi property contains the contract's ABI functions and args contains the necessary arguments for the transaction.
 * 
 * ```json
 * {
 *      "path": "01_interact_with_contract/02_execute_transaction",
 *      "type": "transaction",
 *      "chain": "656476",
 *      "abi": [
 *          {
 *              "name": "transfer",
 *              "inputs": [
 *                  { "name": "to", "type": "address" },
 *                  { "name": "amount", "type": "uint256" }
 *              ],
 *              "outputs": []
 *          }
 *      ],
 *      "contract": "0x1234567890abcdef1234567890abcdef12345678",
 *      "args": ["0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef", 1000]
 * }
 * ```
 * @example
 * This example shows a transaction submission for interacting with a contract on the Ethereum network.
 * 
 * ```json
 * {
 *      "path": "02_interact_with_erc20/01_send_tokens",
 *      "description": "Send tokens from one address to another",
 *      "type": "transaction",
 *      "chain": "1",
 *      "abi": [
 *          {
 *              "name": "transfer",
 *              "inputs": [
 *                  { "name": "to", "type": "address" },
 *                  { "name": "amount", "type": "uint256" }
 *              ],
 *              "outputs": []
 *          }
 *      ],
 *      "contract": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
 *      "args": ["0x1234567890abcdef1234567890abcdef12345678", 500]
 * }
 * ```
 */
export interface Transaction extends Submission {
    /**
     * Indicates that this submission is specifically a transaction.
     * The value is always "transaction" for this interface.
     */
    type: "transaction";

    /**
     * The ABI (Application Binary Interface) of the contract being interacted with.
     * This defines the functions and parameters available for the transaction.
     */
    abi: AbiFunction[];

    /**
     * The address of the contract to be interacted with.
     * This is optional and can be omitted if interacting with a contract that does not require a specific address.
     */
    contract?: string;

    /**
     * The arguments required for the transaction.
     * These values will be passed to the contract function as input parameters.
     */
    args: any[];
}

/**
 * Represents a value submission, including a sender address and a specific numerical value.
 * 
 * Used for quests or transactions that require sending a value from a specified address.
 * 
 * @category Submission
 * @example
 * This example represents a submission where a user sends a specific value on the Open Campus testnet.
 * The `from` property specifies the sender's address, and the `value` represents the numerical amount.
 * 
 * ```json
 * {
 *      "path": "02_send_value/01_basic_transfer",
 *      "type": "value",
 *      "chain": "656476",
 *      "from": "0xa3b2c4d5e6f7890abc123456789def01a2b3c4d5",
 *      "value": "100",
 *      "symbol": "gte"
 * }
 * ```
 * 
 * @example
 * 
 * ```json
 * {
 *      "path": "02_send_value/01_basic_transfer",
 *      "description": "Transfer at least 50 tokens on Sui testnet",
 *      "type": "value",
 *      "chain": "1282977196",
 *      "from": "0x89f7a45cde901b23c45678abcd900ef12a34567b",
 *      "value": "50",
 *      "symbol": "gte"
 * }
 * ```
 */
export interface NativeValue extends Submission {
    /**
     * Specifies that this submission type is a value transaction.
     * The value is always "value" for this interface.
     */
    type: "value";

    /**
     * The sender's address in hexadecimal format.
     * This address must be a valid blockchain address prefixed with "0x".
     */
    from: `0x${string}`;

    /**
     * The numerical value associated with the submission.
     * This typically represents an amount of tokens or native cryptocurrency.
     */
    value: string; // Expected to be a numeric string

    /**
     * An optional comparison symbol used to define conditions for the value.
     * - "eq"  → Equals
     * - "lt"  → Less than
     * - "gt"  → Greater than
     * - "lte" → Less than or equal to
     * - "gte" → Greater than or equal to
     */
    symbol?: "eq" | "lt" | "gt" | "lte" | "gte";
}

/**
 * Represents retrieving a property value from a deployed smart contract.
 * 
 * Used for queries that fetch contract state variables based on ABI and arguments.
 * 
 * @category Submission
 * @example
 * This example retrieves a contract's `totalSupply` value on the Open Campus testnet.
 * The `contract` property specifies the deployed contract address, `variable` defines the function or state variable being queried, 
 * and the `abi` represents the function's ABI definition.
 * 
 * ```json
 * {
 *      "path": "03_query_contract/01_get_total_supply",
 *      "type": "data",
 *      "chain": "656476",
 *      "contract": "0x1234567890abcdef1234567890abcdef12345678",
 *      "variable": "totalSupply",
 *      "abi": [
 *          {
 *              "constant": true,
 *              "inputs": [],
 *              "name": "totalSupply",
 *              "outputs": [{ "name": "", "type": "uint256" }],
 *              "stateMutability": "view",
 *              "type": "function"
 *          }
 *      ]
 * }
 * ```
 * 
 * @example
 * Fetching a user's token balance from a deployed contract on the Sui testnet.
 * The `args` property includes the user address as an input argument.
 * 
 * ```json
 * {
 *      "path": "03_query_contract/02_get_balance",
 *      "description": "Retrieve the token balance of a specific address",
 *      "type": "data",
 *      "chain": "1282977196",
 *      "contract": "0xabcdef1234567890abcdef1234567890abcdef12",
 *      "variable": "balanceOf",
 *      "abi": [
 *          {
 *              "constant": true,
 *              "inputs": [{ "name": "owner", "type": "address" }],
 *              "name": "balanceOf",
 *              "outputs": [{ "name": "balance", "type": "uint256" }],
 *              "stateMutability": "view",
 *              "type": "function"
 *          }
 *      ],
 *      "args": ["0x89f7a45cde901b23c45678abcd900ef12a34567b"]
 * }
 * ```
 */
export interface ContractData extends Submission {
    /**
     * Specifies that this submission type is querying contract data.
     * The value is always "data" for this interface.
     */
    type: "data";

    /**
     * The deployed contract address being queried.
     * This should be a valid blockchain address prefixed with "0x".
     */
    contract?: string;

    /**
     * The name of the function or state variable being retrieved from the contract.
     */
    variable: string;

    /**
     * The ABI (Application Binary Interface) definition for the queried function or variable.
     * This should match the contract's deployed ABI format.
     */
    abi: any[];

    /**
     * Optional arguments required for the function call.
     * These should be passed in the same order as defined in the contract's ABI.
     */
    args?: any[];
}
