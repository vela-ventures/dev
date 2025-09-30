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

  // Parameters for openTrove
  const maxFeePercentage = ethers.utils.parseEther("0.05"); // 5% max fee
  const lusdAmount = ethers.utils.parseEther("210"); // 1000 LUSD to borrow
  const upperHint = ethers.constants.AddressZero; // Can be optimized with actual hints
  const lowerHint = ethers.constants.AddressZero; // Can be optimized with actual hints
  const collAmount = ethers.utils.parseEther("2000"); // 2 AR as collateral

  console.log("Opening trove with parameters:");
  console.log("- Max fee percentage:", ethers.utils.formatEther(maxFeePercentage) + "%");
  console.log("- LUSD amount:", ethers.utils.formatEther(lusdAmount));
  console.log("- Collateral amount:", ethers.utils.formatEther(collAmount), "AR");

  try {
    // Check AR token balance
    const balance = await ArToken.balanceOf(signer.address);
    console.log("AR balance:", ethers.utils.formatEther(balance));

    if (balance.lt(collAmount)) {
      throw new Error(
        `Insufficient AR balance. Need ${ethers.utils.formatEther(
          collAmount
        )} but have ${ethers.utils.formatEther(balance)}`
      );
    }

    // Check current allowance
    const currentAllowance = await ArToken.allowance(signer.address, BORROWER_OPERATIONS_ADDRESS);
    console.log("Current AR allowance:", ethers.utils.formatEther(currentAllowance));

    // Approve AR tokens if needed
    if (currentAllowance.lt(collAmount)) {
      console.log("Approving AR tokens...");
      const approveTx = await ArToken.approve(BORROWER_OPERATIONS_ADDRESS, collAmount);
      console.log("Approval transaction:", approveTx.hash);
      await approveTx.wait();
      console.log("AR tokens approved");
    }
    // Get current gas price and add buffer
    const gasPrice = await signer.provider.getGasPrice();
    const adjustedGasPrice = gasPrice.mul(120).div(100); // 20% buffer

    console.log("Using gas price:", ethers.utils.formatUnits(adjustedGasPrice, "gwei"), "gwei");

    // Call openTrove
    const tx = await BorrowerOperations.openTrove(
      maxFeePercentage,
      lusdAmount,
      upperHint,
      lowerHint,
      collAmount,
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
    console.error("Error opening trove:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
