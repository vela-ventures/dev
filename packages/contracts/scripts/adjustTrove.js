const { ethers } = require("hardhat");

async function main() {
  // Contract addresses
  const BORROWER_OPERATIONS_ADDRESS = "0x4BD4382f9D4653E0E6eA141DC07fc62c73edC9A7";
  const AR_TOKEN_ADDRESS = "0x94E72f7Ce4901D59FB19F1FBE510483511f20BEb";

  // Get signer
  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);

  // Connect to contracts
  const BorrowerOperations = await ethers.getContractAt(
    "BorrowerOperations",
    BORROWER_OPERATIONS_ADDRESS
  );

  // Connect to AR token
  const ArToken = await ethers.getContractAt(
    "contracts/Dependencies/IERC20.sol:IERC20",
    AR_TOKEN_ADDRESS
  );

  // Parameters for adjustTrove - Example: Add 1000 AR collateral and borrow 100 more LUSD
  const maxFeePercentage = ethers.utils.parseEther("0.05"); // 5% max fee
  const collWithdrawal = ethers.utils.parseEther("0"); // No collateral withdrawal
  const collDeposit = ethers.utils.parseEther("1000"); // Add 1000 AR collateral
  const lusdChange = ethers.utils.parseEther("100"); // Borrow 100 more LUSD
  const isDebtIncrease = true; // true = borrowing more, false = repaying
  const upperHint = ethers.constants.AddressZero; // Can be optimized with actual hints
  const lowerHint = ethers.constants.AddressZero; // Can be optimized with actual hints

  console.log("Adjusting trove with parameters:");
  console.log("- Max fee percentage:", ethers.utils.formatEther(maxFeePercentage) + "%");
  console.log("- Collateral withdrawal:", ethers.utils.formatEther(collWithdrawal), "AR");
  console.log("- Collateral deposit:", ethers.utils.formatEther(collDeposit), "AR");
  console.log("- LUSD change:", ethers.utils.formatEther(lusdChange));
  console.log("- Is debt increase:", isDebtIncrease);

  try {
    // If depositing collateral, check AR token balance and approve if needed
    if (collDeposit.gt(0)) {
      const balance = await ArToken.balanceOf(signer.address);
      console.log("AR balance:", ethers.utils.formatEther(balance));

      if (balance.lt(collDeposit)) {
        throw new Error(
          `Insufficient AR balance. Need ${ethers.utils.formatEther(
            collDeposit
          )} but have ${ethers.utils.formatEther(balance)}`
        );
      }

      // Check current allowance
      const currentAllowance = await ArToken.allowance(signer.address, BORROWER_OPERATIONS_ADDRESS);
      console.log("Current AR allowance:", ethers.utils.formatEther(currentAllowance));

      // Approve AR tokens if needed
      if (currentAllowance.lt(collDeposit)) {
        console.log("Approving AR tokens...");
        const approveTx = await ArToken.approve(BORROWER_OPERATIONS_ADDRESS, collDeposit);
        console.log("Approval transaction:", approveTx.hash);
        await approveTx.wait();
        console.log("AR tokens approved");
      }
    }

    // Get current gas price and add buffer
    const gasPrice = await signer.provider.getGasPrice();
    const adjustedGasPrice = gasPrice.mul(120).div(100); // 20% buffer

    console.log("Using gas price:", ethers.utils.formatUnits(adjustedGasPrice, "gwei"), "gwei");

    // Call adjustTrove
    const tx = await BorrowerOperations.adjustTrove(
      maxFeePercentage,
      collWithdrawal,
      collDeposit,
      lusdChange,
      isDebtIncrease,
      upperHint,
      lowerHint,
      {
        gasPrice: adjustedGasPrice
      }
    );

    console.log("Transaction submitted:", tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    console.log("Gas used:", receipt.gasUsed.toString());
  } catch (error) {
    console.error("Error adjusting trove:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
