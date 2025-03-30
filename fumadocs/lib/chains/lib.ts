import { data as NAME } from "./name"

export const getNetworkNameFromChainID = (network: string): string =>
    NAME[network] || ""