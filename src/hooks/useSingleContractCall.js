import { useCallback, useEffect, useMemo, useState } from "react";
import { useWeb3Context } from "../context/web3";
import useBlockNumber from "./useBlockNumber";

export default function useSingleContractCall (contract, method, args = []) {
    const { chainId } = useWeb3Context()

    const blockNumber = useBlockNumber()

    const [result, setResult] = useState(null)

    const memoArgs = useMemo(() => args, [args])

    const call = useCallback(async () => {
        if (!contract || !method) return

        const callResult = await contract.methods[method](...memoArgs).call()

        setResult(callResult)
    }, [contract, memoArgs, method])

    useEffect(() => {
        if (memoArgs.includes(undefined)) return
        
        call()
    }, [contract, method, memoArgs, chainId, call, blockNumber])

    return result
}
