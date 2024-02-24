---
sidebar_position: 1
---

import SolideIDE from '@site/src/components/SolideIDE'

# Aspect - IDE

This document provides instructions on how to load the Aspect IDE using an iframe or via SolideIDE.

## Sample

the following example is loading the (`Aspect.ts`) contract in Solide IDE.

```html title="Aspect.ts" showLineNumbers
<iframe 
  src="https://solidewidget.azurewebsites.net/aspect"
  height="400" width="300"></iframe>
```

<SolideIDE url="https://solidewidget.azurewebsites.net/aspect"></SolideIDE>

# To load the Aspect IDE from GitHub

## Parameters

### Required
- `url`: Required. The URL of the contract source code to load. This must be in a valid GitHub typescript file format.

