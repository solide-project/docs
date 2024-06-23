---
sidebar_position: 1
---

import SolideIDE from '@site/src/components/SolideIDE'
import { SolideURL } from '@site/src/lib/constants'

# Aspectide (Coming Soon!)

This document provides instructions on how to load the Aspect IDE using an iframe or via SolideIDE.

# Movide (Coming Soon!)

## Resource
- [Source Code](https://github.com/solide-project/aspectide)
- [Aspect IDE](https://aspect.solide0x.tech/)

## Sample

the following example is loading the (`Aspect.ts`) contract in Solide IDE.

```html title="Aspect.ts" showLineNumbers
<iframe 
  src="{SolideURL}/aspect"
  height="400" width="300"></iframe>
```

<SolideIDE url={`${SolideURL}/aspect`}></SolideIDE>

# To load the Aspect IDE from GitHub

## Parameters

### Required
- `url`: Required. The URL of the contract source code to load. This must be in a valid GitHub typescript file format.

