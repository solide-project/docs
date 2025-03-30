import { ChainID } from '@/lib/chains/chain-id';
import { getIconByChainId } from '@/lib/chains/icon';
import { getNetworkNameFromChainID } from '@/lib/chains/lib';
import type { ReactNode } from 'react';

const chains = Object.entries(ChainID)
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

export default function ChainTable({ children }: { children: ReactNode }) {
    return <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Network</th>
                <th>Address</th>
            </tr>
        </thead>
        <tbody>
            {chains.sort((a: any, b: any) => a[1] - b[1]).map(([_, value], index: number) => (
                <tr key={index}>
                    <td>{value}</td>
                    <td>
                        <img src={getIconByChainId(value)}
                            className="m-0!"
                            height={28}
                            width={28}
                            alt="icon"
                        />
                    </td>
                    <td>{getNetworkNameFromChainID(value)}</td>
                </tr>
            ))}
        </tbody>
    </table>
}
