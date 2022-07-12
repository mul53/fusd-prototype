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

export default function Redeem() {
  const { account, toggleWeb3Modal } = useWeb3Context();

  const [token, setToken] = useState();

  const handleChange = useCallback((e) => {
    setToken(e.target.value);
  }, []);

  const [amount, setAmount] = useState("0");
  const parsedAmount = useMemo(
    () =>
      amount
        ? new BigNumber(amount)
            .multipliedBy(new BigNumber(10).pow(18))
            .toString()
        : "0",
    [amount]
  );
  const balance = useTokenBalance(MASSET_ADDRESS ?? undefined);
  const formattedBalance = useMemo(
    () =>
      new BigNumber(balance).dividedBy(new BigNumber(10).pow(18)).toString(),
    [balance]
  );
  const [approvalState, approvalCallback] = useTokenApprovalCallback(
    MASSET_ADDRESS,
    parsedAmount,
    MASSET_ADDRESS
  );

  const massetContract = useContract(MASSET_ADDRESS, MASSET_ABI);

  const onRedeem = useCallback(async () => {
    if (!account) return;

    try {
      await massetContract.methods
        .redeem(token, parsedAmount, "0", account)
        .send({
          from: account,
        });

      setAmount('0')

      alert(`txn confirmed`);
    } catch (e) {
      alert(`txn failed: ${e}`);
    }
  }, [account, massetContract, parsedAmount, token]);

  return (
    <div>
      <div className="flex justify-between text-gray-900 dark:text-white my-4">
        <div>fUSD</div>
        <div>Balance: {formattedBalance}</div>
      </div>

      <div>
        <select
          id="countries"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm mt-2 mb-4 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={token}
          onChange={handleChange}
        >
          <option>Select output stablecoin</option>
          <option value={USDT_ADDRESS}>USDT</option>
          <option value={BUSD_ADDRESS}>BUSD</option>
          <option value={USDC_ADDRESS}>USDC</option>
        </select>
      </div>

      <div className="mb-6">
        <div className="mb-4">
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={amount}
            placeholder="Enter amount"
            onChange={(e) => setAmount(e.target.value ?? "0")}
          />
        </div>

        {approvalState === ApprovalState.NOT_APPROVED && (
          <Button onClick={() => approvalCallback()}>Approve</Button>
        )}

        {account ? (
          <Button onClick={onRedeem}>Redeem</Button>
        ) : (
          <Button onClick={toggleWeb3Modal}>Connect</Button>
        )}
      </div>
    </div>
  );
}
