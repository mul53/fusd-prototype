import { useWeb3Context } from "../context/web3";
import { useTokenContract } from "./useContract";
import useSingleContractCall from "./useSingleContractCall";

export default function useTokenBalance (address) {
    const { account } = useWeb3Context()

    return useSingleContractCall(
        useTokenContract(address), 
        'balanceOf', 
        [account ?? undefined]
    )
}
