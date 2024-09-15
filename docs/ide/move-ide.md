---
sidebar_position: 1
---

# Movide

Movide is an online Integrated Development Environment (IDE) that redefines Move programming for blockchain networks such as Movement and SUI. It is designed to streamline Move development by providing a simple, lightweight UI packed with feature-rich tools. Much like Remix for Solidity, Movide brings a dedicated Move-based IDE to the browser, enabling seamless compiling, building, and deploying of Move packages on-chain. What sets Movide apart is its unique ability to load Move packages directly from GitHub or verified on-chains packages into the IDE, facilitating a novel solution for developers aiming to deploy on Movement.

## Resource
- [Source Code](https://github.com/solide-project/movide)
- [Movide IDE](https://move.solide0x.tech/)

### Compile and Deploy

Movide simplifies the process of compiling and deploying Move programs. After loading a program from **GitHub** or a **verified on-chain source**, developers can compile the code directly in the IDE. The first compilation may take longer, but subsequent ones will be faster. Once compiled, users can deploy the program on supported networks like **Movement M2** or **SUI**. Movide requires a compatible wallet, such as **SUI Wallet**, for deployment, and supports multiple networks, including devnet, testnet, and mainnet. The IDE also allows developers to configure settings like the path to the **Move.toml** file for custom builds.

<img
    className="rounded-lg w-full"
    src="/img/docs/movide-wallet.png"
    alt="cover"
/>

<img
    className="rounded-lg w-full"
    src="/img/docs/movide-interact.png"
    alt="cover"
/>


### Object Viewing

Movide allows developers to easily view and interact with on-chain objects by loading them via **object ID** or **transaction digest**. Once loaded, objects such as counters or tokens can be viewed and managed directly within the IDE. The integrated **console** displays transaction details and object creation info, while a dedicated **object tab** enables users to inspect and interact with objects in real-time. This feature simplifies on-chain data management, offering seamless interaction with Move-based objects within the IDE.

<img
    className="rounded-lg w-full"
    src="/img/docs/movide-object.png"
    alt="cover"
/>