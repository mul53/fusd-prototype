import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";
import { useWeb3Context } from "../../context/web3";
import { useContract } from "../../hooks/useContract";
import useTokenBalance from "../../hooks/useTokenBalance";
import {
  BUSD_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
  MASSET_ADDRESS,
} from "../../constants";
import MASSET_ABI from "../../constants/abi/masset.json";
import useTokenApprovalCallback, {
  ApprovalState,
} from "../../hooks/useTokenApprove";
import Button from "../../components/button";
import useSingleContractCall from "../../hooks/useSingleContractCall";

export default function MultiRedeem() {
  const { account, toggleWeb3Modal } = useWeb3Context();

  const [usdcAmount, setUsdcAmount] = useState("0");
  const usdcParsedAmount = useMemo(
    () =>
      usdcAmount
        ? new BigNumber(usdcAmount)
            .multipliedBy(new BigNumber(10).pow(6))
            .toString()
        : "0",
    [usdcAmount]
  );

  const [busdAmount, setBusdAmount] = useState("0");
  const busdParsedAmount = useMemo(
    () =>
      busdAmount
        ? new BigNumber(busdAmount)
            .multipliedBy(new BigNumber(10).pow(18))
            .toString()
        : "0",
    [busdAmount]
  );

  const [usdtAmount, setUsdtAmount] = useState("0");
  const usdtParsedAmount = useMemo(
    () =>
      usdtAmount
        ? new BigNumber(usdtAmount)
            .multipliedBy(new BigNumber(10).pow(6))
            .toString()
        : "0",
    [usdtAmount]
  );

  const balance = useTokenBalance(MASSET_ADDRESS ?? undefined);
  const formattedBalance = useMemo(
    () =>
      new BigNumber(balance).dividedBy(new BigNumber(10).pow(18)).toString(),
    [balance]
  );

  const balancesWithAddresss = useMemo(
    () => [
      [USDC_ADDRESS, usdcParsedAmount],
      [BUSD_ADDRESS, busdParsedAmount],
      [USDT_ADDRESS, usdtParsedAmount],
    ],
    [busdParsedAmount, usdcParsedAmount, usdtParsedAmount]
  );

  const filteredBalancesWithAddresses = balancesWithAddresss.filter(
    ([address, balance]) => Number(balance) > 0
  );

  const massetContract = useContract(MASSET_ADDRESS, MASSET_ABI);

  const call = useMemo(
    () => [
      filteredBalancesWithAddresses.map((v) => v[0]).length > 0
        ? filteredBalancesWithAddresses.map((v) => v[0])
        : undefined,
      filteredBalancesWithAddresses.map((v) => v[1]).length > 0
        ? filteredBalancesWithAddresses.map((v) => v[1])
        : undefined,
    ],
    [filteredBalancesWithAddresses]
  );

  const expectedMasset = useSingleContractCall(
    massetContract,
    "getRedeemExactBassetsOutput",
    call
  );

  const formattedExpectedMasset = useMemo(
    () =>
      new BigNumber(expectedMasset)
        .dividedBy(new BigNumber(10).pow(18))
        .toString(),
    [expectedMasset]
  );

  const [approvalState, approvalCallback] = useTokenApprovalCallback(
    MASSET_ADDRESS,
    expectedMasset ?? undefined,
    MASSET_ADDRESS
  );

  const onRedeem = useCallback(async () => {
    if (!account) return;

    try {
      await massetContract.methods
        .redeemExactBassets(call[0], call[1], expectedMasset, account)
        .send({
          from: account,
        });

      setUsdtAmount("0");
      setBusdAmount("0");
      setUsdcAmount("0");

      alert(`txn confirmed`);
    } catch (e) {
      alert(`txn failed: ${e}`);
    }
  }, [account, call, expectedMasset, massetContract]);

  return (
    <div>
      <div className="flex justify-between text-gray-900 dark:text-white my-4">
        <div>fUSD</div>
        <div>Balance: {formattedBalance}</div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-gray-900 dark:text-white mb-2">
          <div>USDT</div>
        </div>
        <div className="mb-4">
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={usdtAmount}
            placeholder="Enter amount"
            onChange={(e) => setUsdtAmount(e.target.value ?? "0")}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-gray-900 dark:text-white mb-2">
          <div>BUSD</div>
        </div>
        <div className="mb-4">
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={busdAmount}
            placeholder="Enter amount"
            onChange={(e) => setBusdAmount(e.target.value ?? "0")}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-gray-900 dark:text-white mb-2">
          <div>USDC</div>
        </div>
        <div className="mb-4">
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={usdcAmount}
            placeholder="Enter amount"
            onChange={(e) => setUsdcAmount(e.target.value ?? "0")}
          />
        </div>
      </div>

      <div className="flex justify-between text-gray-900 dark:text-white my-4">
        <div>fUSD to burn: {formattedExpectedMasset}</div>
      </div>

      <div className="mb-6">
        {approvalState === ApprovalState.NOT_APPROVED && (
          <Button onClick={() => approvalCallback()}>Approve</Button>
        )}
      </div>

      {account ? (
        <Button onClick={onRedeem}>Redeem</Button>
      ) : (
        <Button onClick={toggleWeb3Modal}>Connect</Button>
      )}
    </div>
  );
}
