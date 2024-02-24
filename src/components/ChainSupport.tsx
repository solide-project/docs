import { ChainID, getIconByChainId, getNetworkNameFromChainID } from "@site/src/lib/chains";

const chains = Object.entries(ChainID)
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

const ChainSupport = ({ children, url }) => {
    return (
        <div className="">
            <div className="py-4">
                Total Chains (including testnet): {chains.length || 0}
            </div>
            <div className="py-8">
                {chains.map(([_, value], index: number) => (
                    <img
                        key={index}
                        // className="p-2/5"
                        src={getIconByChainId(value)}
                        height={32}
                        width={32}
                        alt="icon"
                    />
                ))}
            </div>

            {chains.sort((a: any, b: any) => a[1] - b[1]).map(([_, value], index: number) => (
                <div className="flex items-center justify-between space-y-4">
                    <img
                        key={index}
                        src={getIconByChainId(value)}
                        height={32}
                        width={32}
                        alt="icon"
                    />
                    <div>
                        {getNetworkNameFromChainID(value)}
                    </div>
                    <div>
                        {value}
                    </div>
                </div>
            ))}
        </div>
    )
};

export default ChainSupport;