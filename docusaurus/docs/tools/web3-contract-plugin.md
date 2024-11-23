---
sidebar_position: 1
description: Contract Plugin for Web3.js.
---

# Web3 Plugin Contracts

`web3-plugin-contracts` is a TypeScript library and a Web3.js plugin designed to simplify the process of loading and accessing source contracts and interacting with smart contracts. With this plugin, developers can seamlessly interact with Web3's Contracts class using only a contract address.

## Resource
- [Npm Package](https://www.npmjs.com/package/web3-plugin-contracts)
- [Source Code](https://github.com/solide-project/web3-plugin-contracts)
- [Featured in Web3js](https://web3js.org/plugins)

## Getting Started

```bash
npm i web3 web3-plugin-contracts
```

## Sample

```typescript
import Web3, { Contract } from "web3";
import { ContractPlugin } from 'web3-plugin-contract';

// Given a RPC, create web3 instance
const rpc: string = 'https://eth.drpc.org/';
const web3 = new Web3(
	new Web3.providers.HttpProvider(rpc));

// Optional API key, need for etherscan related chains
const API_KEY = ""; 

// Load plugin
web3.registerPlugin(new ContractPlugin(API_KEY));

// Verified smart contract
const contractAddress = "0x75cb093E4D61d2A2e65D8e0BBb01DE8d89b53481";

// Get contract source: includes, source code, compiler information, metadata
const data = await web3.contractPlugin.source(contractAddress);
console.log(data)

// Get web3 Contract instance
const contract: Contract = await web3.contractPlugin.contract(contractAddress);
const name: string = await contract.methods.name().call()
```