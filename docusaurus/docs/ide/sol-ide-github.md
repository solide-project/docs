---
sidebar_position: 1
---

import SolideIDE from '@site/src/components/SolideIDE'
import { SolideURL } from '@site/src/lib/constants'

# Import a Solidty from Github to Solide

This document provides instructions on how to load a smart contract directly from GitHub using an iframe or via SolideIDE.

## Resource
- [Source Code](https://github.com/solide-project/solide)
- [Solide IDE](https://solide0x.tech/)

## Parameters

### Required
- `url`: Required. The URL of the contract source code to load. This must be in a valid GitHub Solidity file format.

### Optional
- `version`: Optional. A valid Solidity version to use for compilation. Defaults to the latest version.
  - For list of valid versions, see [Solidity Releases](https://binaries.soliditylang.org/bin/list.json)
- `remappings`: Optional. A list of remappings to use for compilation. Defaults to an empty list.
  - Note: This currently only supports remappings for *OpenZeppelin contracts* and *Uniswap v3*.
  - Example: The following parameter will remap all imports from `@openzeppelin/openzeppelin-contracts` to `@openzeppelin/openzeppelin-contracts@4.3.0`.
``` title="Remapping" showLineNumbers
remappings=@openzeppelin/openzeppelin-contracts=@openzeppelin/openzeppelin-contracts@4.3.0"
```

## Sample

The following example is loading the (`MintableERC20.sol`) contract from our Solide Guides GitHub (`solide-project/solide-guides`) repository.

```html title="MintableERC20.sol" showLineNumbers
<iframe 
  src="{SolideURL}?url=https://github.com/solide-project/solide-guides/blob/master/src/openzeppelin/MintableERC20/MintableERC20.sol"
  height="400" width="300"></iframe>
```
<!-- 
<SolideIDE 
  url={`${SolideURL}?url=https://github.com/solide-project/solide-guides/blob/master/src/openzeppelin/MintableERC20/MintableERC20.sol`}>
</SolideIDE> -->
