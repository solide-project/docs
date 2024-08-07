---
sidebar_position: 1
---

import SolideIDE from '@site/src/components/SolideIDE'
import { SolideURL } from '@site/src/lib/constants'

# Import a contract address in Solide

This document provides instructions on how to load a **verified** smart contract directly from a chain using an iframe or via SolideIDE.

## Resource
- [Source Code](https://github.com/solide-project/solide)
- [Solide IDE](https://solide0x.tech/)

## Parameters

### Required
- `chainId`: Required. The chain ID of the contract to load. See [Chain IDs](/docs/supported-chains) for a list of valid chain IDs.
- `address`: Required. A valid contract address to load that must be verified or have its implementation verified if the contract is using a proxy.

## Sample

The following example demonstrates how to load a verified Wrapped Ether (`MaticWETH`) contract from the Polygon Mainnet (`137`).

```html title="MaticWETH.sol" showLineNumbers
<iframe 
  src="{SolideURL}/address/137/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"
  height="400" width="300"></iframe>
```

<!-- <SolideIDE url={`${SolideURL}/address/137/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619`}></SolideIDE> -->
