/**
 * Represents metadata for a Proof of Learn POAP.
 * @example
 * ```json
 * {
 *      "name": "Proof of Learn Genesis",
 *      "description": "This is for all those that participated in the Proof of Learn Genesis event. This is a special NFT so thanks :)",
 *      "image": "ipfs://QmStw2E79stkmBH9kjjRYHVoPNztrbQsxXchfxTnmRVh3h"
 * }
 * ```
 */
export interface POAPMetadata {
  /**
   * The name of the POAP.
   * @example Proof of Learn Genesis
   */
  name: string;

  /**
   * A description of the POAP, detailing its purpose or significance.
   * @example This is for all those that participated in the Proof of Learn Genesis event. This is a special NFT so thanks :)
   */
  description: string;

  /**
   * The image URL for the POAP, must be IPFS cid.
   * @example ipfs://QmStw2E79stkmBH9kjjRYHVoPNztrbQsxXchfxTnmRVh3h
   */
  image: string;
}

