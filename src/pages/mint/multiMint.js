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

export default function MultiMint() {
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
  const usdcBalance = useTokenBalance(USDC_ADDRESS);
  const formattedUsdcBalance = useMemo(
    () =>
      new BigNumber(usdcBalance).dividedBy(new BigNumber(10).pow(6)).toString(),
    [usdcBalance]
  );
  const [usdcApprovalState, usdcApprovalCallback] = useTokenApprovalCallback(
    USDC_ADDRESS,
    usdcParsedAmount,
    MASSET_ADDRESS
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
  const busdBalance = useTokenBalance(BUSD_ADDRESS);
  const formattedBusdBalance = useMemo(
    () =>
      new BigNumber(busdBalance)
        .dividedBy(new BigNumber(10).pow(18))
        .toString(),
    [busdBalance]
  );
  const [busdApprovalState, busdApprovalCallback] = useTokenApprovalCallback(
    BUSD_ADDRESS,
    busdParsedAmount,
    MASSET_ADDRESS
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
  const usdtBalance = useTokenBalance(USDT_ADDRESS);
  const formattedUsdtBalance = useMemo(
    () =>
      new BigNumber(usdtBalance).dividedBy(new BigNumber(10).pow(6)).toString(),
    [usdtBalance]
  );
  const [usdtApprovalState, usdtApprovalCallback] = useTokenApprovalCallback(
    USDT_ADDRESS,
    usdtParsedAmount,
    MASSET_ADDRESS
  );

  const balances = useMemo(
    () => [usdcParsedAmount, busdParsedAmount, usdtParsedAmount],
    [busdParsedAmount, usdcParsedAmount, usdtParsedAmount]
  );

  const massetContract = useContract(MASSET_ADDRESS, MASSET_ABI);

  const onMint = useCallback(async () => {
    if (!account) return;

    try {
      const tokens = [USDT_ADDRESS, BUSD_ADDRESS, USDC_ADDRESS];

      await massetContract.methods
        .mintMulti(tokens, balances, "0", account)
        .send({
          from: account,
        });

      setBusdAmount("0");
      setUsdcAmount("0");
      setUsdtAmount("0");

      alert(`txn confirmed`);
    } catch (e) {
      alert(`txn failed: ${e}`);
    }
  }, [account, balances, massetContract]);

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between text-gray-900 dark:text-white mb-2">
          <div>USDT</div>
          <div>Balance: {formattedUsdtBalance}</div>
        </div>
        <div className="mb-4">
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={usdtAmount}
            placeholder="Enter amount"
            onChange={(e) => setUsdtAmount(e.target.value ?? "0")}
          />
        </div>
        {usdtApprovalState === ApprovalState.NOT_APPROVED && (
          <Button onClick={() => usdtApprovalCallback()}>Approve USDT</Button>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-gray-900 dark:text-white mb-2">
          <div>BUSD</div>
          <div>Balance: {formattedBusdBalance}</div>
        </div>
        <div className="mb-4">
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={busdAmount}
            placeholder="Enter amount"
            onChange={(e) => setBusdAmount(e.target.value ?? "0")}
          />
        </div>
        {busdApprovalState === ApprovalState.NOT_APPROVED && (
          <Button onClick={() => busdApprovalCallback()}>Approve BUSD</Button>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-gray-900 dark:text-white mb-2">
          <div>USDC</div>
          <div>Balance: {formattedUsdcBalance}</div>
        </div>
        <div className="mb-4">
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={usdcAmount}
            placeholder="Enter amount"
            onChange={(e) => setUsdcAmount(e.target.value ?? "0")}
          />
        </div>
        {usdcApprovalState === ApprovalState.NOT_APPROVED && (
          <Button onClick={() => usdcApprovalCallback()}>Approve USDC</Button>
        )}
      </div>

      {account ? (
        <Button onClick={onMint}>Mint</Button>
      ) : (
        <Button onClick={toggleWeb3Modal}>Connect</Button>
      )}
    </div>
  );
}
