import { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import { Decimal } from "@liquity/lib-base";
import { useLiquity } from "./LiquityContext";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

const ARWEAVE_TOKEN_ADDRESS = "0x611B6deD9b7029592D8eccBcF8Ca10Bb88B80c4D";

export function useArweaveBalance(): Decimal {
  const { account, provider } = useLiquity();
  const [balance, setBalance] = useState<Decimal>(Decimal.ZERO);

  useEffect(() => {
    if (!account || !provider) {
      setBalance(Decimal.ZERO);
      return;
    }

    const fetchBalance = async () => {
      try {
        const contract = new ethers.Contract(ARWEAVE_TOKEN_ADDRESS, ERC20_ABI, provider);
        const balanceResult: BigNumber = await contract.balanceOf(account);
        const formattedBalance = Decimal.fromBigNumberString(balanceResult.toString());
        setBalance(formattedBalance);
      } catch (error) {
        console.error("Failed to fetch Arweave balance:", error);
        setBalance(Decimal.ZERO);
      }
    };

    fetchBalance();

    // Set up polling to update balance periodically
    const intervalId = setInterval(fetchBalance, 10000); // Update every 10 seconds

    return () => clearInterval(intervalId);
  }, [account, provider]);

  return balance;
}