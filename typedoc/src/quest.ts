import { Deployment, Transaction } from ".";

export interface QuestConfig {
    metadata: QuestMetadata;
    quests: (Transaction | Deployment)[]
}

/**
 * Represents a course object with metadata and deployment details.
 * @example
 * ```json
 * {
 *      "owner": "polearn",
 *      "name": "pol-template",
 *      "chain": "656476",
 *      "title": "Deploy Your First Smart Contract on Open Campus",
 *      "description": "This course guides you through deploying your first smart contract on Open Campus. It also serves as a template for creating engaging and user-friendly courses on Proof of Learn.",
 *      "image": "https://raw.githubusercontent.com/POLearn/pol-template/refs/heads/master/content/assets/cover.png"
 * }
 * ```
 */
export interface QuestMetadata {
    /**
     * The username or identifier of the owner of the course.
     * @example polearn
     */
    owner: string;

    /**
     * The unique name of the course.
     * Typically used to identify the course programmatically.
     * @example pol-template
     */
    name: string;

    /**
     * The chain identifier where the course's smart contract is deployed.
     * This is often a numerical chain ID.
     * @example 
     * 65647632545435
     */
    chain: string;

    /**
     * The title of the course.
     * This is a user-friendly name displayed in the UI.
     * @example Deploy Your First Smart Contract on Open Campus
     */
    title: string;

    /**
     * A description of the course.
     * Provides additional context and information about what the course covers.
     * @example This course guides you through deploying your first smart contract on Open Campus.
     */
    description: string;

    /**
     * A URL pointing to the cover image of the course.
     * The image is typically used as a visual representation for the course.
     * @example https://raw.githubusercontent.com/POLearn/pol-template/refs/heads/master/content/assets/cover.png
     */
    image: string;
}
