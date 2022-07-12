import { useMemo } from "react";
import { useWeb3Context } from "../context/web3";
import ERC20_ABI from '../constants/abi/erc20.json'

export function useContract (address, ABI) {
    const { web3 } = useWeb3Context()

    return useMemo(() => {
        if (!web3 || !address || !ABI) return null
        return new web3.eth.Contract(ABI, address)
    }, [address, web3, ABI])
}

export function useTokenContract (address) {
    return useContract(address, ERC20_ABI)
}
