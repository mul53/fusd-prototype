import { useCallback, useEffect, useState } from "react";
import { useWeb3Context } from "../context/web3";

export default function useBlockNumber() {
    const [blockNumber, setBlockNumber] = useState()

    const { web3 } = useWeb3Context()

    const fetchLatestBlockNumber = useCallback(async () => {
        if (!web3) return

        return await web3.eth.getBlockNumber()
    }, [web3])

    useEffect(() => {
        const fetch = async () => {
            const latestBlockNumber = await fetchLatestBlockNumber()
            if (typeof latestBlockNumber === 'number') {
                setBlockNumber(latestBlockNumber)
            }
            setTimeout(fetch, 5000)
        }
        
        setTimeout(fetch, 5000)
    }, [fetchLatestBlockNumber])

    return blockNumber
}
