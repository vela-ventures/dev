import { BigNumber, constants, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useLiquity } from "./LiquityContext";

const ERC20_ABI = ["function allowance(address owner, address spender) view returns (uint256)"];

const ARWEAVE_TOKEN_ADDRESS = "0x94E72f7Ce4901D59FB19F1FBE510483511f20BEb";

export function useCollateralApproval(): boolean {
  const { account, provider, liquity } = useLiquity();
  const [isApproved, setIsApproved] = useState<boolean>(false);

  useEffect(() => {
    if (!account || !provider || !liquity) {
      setIsApproved(false);
      return;
    }

    const checkApproval = async () => {
      try {
        // Get borrower operations contract address
        const borrowerOperationsAddress = liquity.connection.addresses.borrowerOperations;

        // Create AR token contract instance
        const arTokenContract = new ethers.Contract(ARWEAVE_TOKEN_ADDRESS, ERC20_ABI, provider);

        // Check allowance
        const allowance: BigNumber = await arTokenContract.allowance(
          account,
          borrowerOperationsAddress
        );

        // Check if allowance is sufficient (similar to the bonds approach)
        // Using MaxInt256 as threshold for "infinite" approval
        const isInfinitelyApproved = allowance.gt(constants.MaxInt256.div(2));

        setIsApproved(isInfinitelyApproved);
      } catch (error) {
        console.error("Failed to check collateral approval:", error);
        setIsApproved(false);
      }
    };

    checkApproval();

    // Set up polling to update approval status periodically
    const intervalId = setInterval(checkApproval, 10000); // Update every 10 seconds

    return () => clearInterval(intervalId);
  }, [account, provider, liquity]);

  return isApproved;
}
