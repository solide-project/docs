import Quest from '@site/src/components/pol/Quest'

# quest.config.json

The `quest.config.json` serves as the configuration blueprint for defining and managing quests in the Proof of Learn platform. It provides a structured format for specifying key metadata, such as the quest's title, description, prerequisites, and any associated quests. This configuration ensures that quests are easily deployable, maintainable, and compatible with the platform's dynamic questing system. By using `quest.config.json`, creators can streamline the setup of interactive and engaging learning experiences while maintaining consistency and scalability with their blockchain and smart contracts.

> For a detailed example of a `quest.config.json` file, refer to the [PoL Course Template](https://github.com/POLearn/pol-template/blob/master/quest.config.json).

## Metadata

<Quest componentName="QuestMetadata" />

## Quests

The quest field provides a list of [Transaction](../quest/transaction.md) and [Deployment](../quest/deployment.md) quests. Click on the respective links to access detailed documentation for each type of quest.