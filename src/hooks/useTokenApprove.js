import BigNumber from "bignumber.js";
import { useCallback, useMemo } from "react";
import { useWeb3Context } from "../context/web3";
import { useTokenContract } from "./useContract";
import useSingleContractCall from "./useSingleContractCall";

export const ApprovalState = {
  UNKNOWN: 0,
  NOT_APPROVED: 1,
  APPROVED: 2,
};

export default function useTokenApprovalCallback(
  tokenAddress,
  amountToApprove,
  spender
) {
  const { account } = useWeb3Context();
  const currentAllowance = useSingleContractCall(
    useTokenContract(tokenAddress),
    "allowance",
    [account ?? undefined, spender ?? undefined]
  );

  const approvalState = useMemo(() => {
    if (!amountToApprove || !spender || !currentAllowance) return ApprovalState.UNKNOWN;

    return new BigNumber(currentAllowance).lt(amountToApprove)
      ? ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amountToApprove, currentAllowance, spender]);

  const tokenContract = useTokenContract(tokenAddress);

  const approve = useCallback(async () => {
    if (approvalState !== ApprovalState.NOT_APPROVED) return;

    if (!tokenAddress || !tokenContract || !amountToApprove || !spender) return;

    await tokenContract.methods
      .approve(spender, amountToApprove)
      .send({ from: account });
  }, [
    account,
    amountToApprove,
    approvalState,
    spender,
    tokenAddress,
    tokenContract,
  ]);

  return [approvalState, approve];
}
