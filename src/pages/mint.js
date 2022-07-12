import { useState } from "react";
import { useWeb3Context } from "../context/web3";
import MultiMint from "./mint/multiMint";
import Mint from "./mint/mint";
import MultiRedeem from "./redeem/multiRedeem";
import Redeem from "./redeem/redeem";

export default function MintPage() {
  const { account } = useWeb3Context();

  const [isMultiMint, setIsMultiMint] = useState();

  const [isMultiRedeem, setIsMultiRedeem] = useState()

  return (
    <div>
      <div className="mint-card p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 mx-auto mt-6">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Mint
        </h5>
        <h4 className="text-gray-900 dark:text-white mb-6">
          Connected Account: {account}
        </h4>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            onClick={() => setIsMultiMint(false)}
          >
            Mint
          </button>
          <button
            type="button"
            className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            onClick={() => setIsMultiMint(true)}
          >
            Multi Mint
          </button>
        </div>
        {isMultiMint ? <MultiMint /> : <Mint />}
      </div>

      <div className="mint-card p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 mx-auto mt-6">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Redeem
        </h5>
        <h4 className="text-gray-900 dark:text-white mb-6">
          Connected Account: {account}
        </h4>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            onClick={() => setIsMultiRedeem(false)}
          >
            Redeem
          </button>
          <button
            type="button"
            className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            onClick={() => setIsMultiRedeem(true)}
          >
            Multi Redeem
          </button>
        </div>
        {isMultiRedeem ? <MultiRedeem /> : <Redeem />}
      </div>
    </div>
  );
}
