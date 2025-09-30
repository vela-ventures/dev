const { ethers } = require("hardhat");

async function main() {
  // Contract addresses from deployment
  const TROVE_MANAGER_ADDRESS = "0x067754605aBD072A515Bca2b4917ffB767F1De2F";
  const ACTIVE_POOL_ADDRESS = "0xFD7CEB23Bbdd2a226e7f7fBB74A487211ee24D92";
  const DEFAULT_POOL_ADDRESS = "0x22Aa78bf32c2B713B192a3e71A593159c196403a";
  const BORROWER_OPERATIONS_ADDRESS = "0x4BD4382f9D4653E0E6eA141DC07fc62c73edC9A7";

  // Get signer
  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);
  console.log("==========================================");

  // Connect to contracts
  const TroveManager = await ethers.getContractAt("TroveManager", TROVE_MANAGER_ADDRESS);
  const ActivePool = await ethers.getContractAt("ActivePool", ACTIVE_POOL_ADDRESS);
  const DefaultPool = await ethers.getContractAt("DefaultPool", DEFAULT_POOL_ADDRESS);

  try {
    console.log("1. CHECKING TROVE STATUS");
    console.log("==========================================");

    // Check trove status (0 = nonExistent, 1 = active, 2 = closedByOwner, 3 = closedByLiquidation, 4 = closedByRedemption)
    const troveStatus = await TroveManager.getTroveStatus(signer.address);
    console.log("Trove Status:", troveStatus.toString());
    console.log("Status meaning:", {
      0: "Non-existent",
      1: "Active",
      2: "Closed by Owner",
      3: "Closed by Liquidation",
      4: "Closed by Redemption"
    }[troveStatus.toString()] || "Unknown");

    if (troveStatus.toString() === "1") {
      // If trove is active, get its details
      const troveColl = await TroveManager.getTroveColl(signer.address);
      const troveDebt = await TroveManager.getTroveDebt(signer.address);
      console.log("Trove Collateral:", ethers.utils.formatEther(troveColl), "AR");
      console.log("Trove Debt:", ethers.utils.formatEther(troveDebt), "LUSD");
    }

    console.log("\n2. CHECKING ACTIVE POOL");
    console.log("==========================================");

    // Check ActivePool balances
    const activeCollateral = await ActivePool.getCollateralBalance();
    const activeLUSDDebt = await ActivePool.getLUSDDebt();
    console.log("ActivePool Collateral:", ethers.utils.formatEther(activeCollateral), "AR");
    console.log("ActivePool LUSD Debt:", ethers.utils.formatEther(activeLUSDDebt), "LUSD");

    console.log("\n3. CHECKING DEFAULT POOL");
    console.log("==========================================");

    // Check DefaultPool balances
    const defaultCollateral = await DefaultPool.getCollateralBalance();
    const defaultLUSDDebt = await DefaultPool.getLUSDDebt();
    console.log("DefaultPool Collateral:", ethers.utils.formatEther(defaultCollateral), "AR");
    console.log("DefaultPool LUSD Debt:", ethers.utils.formatEther(defaultLUSDDebt), "LUSD");

    console.log("\n4. TOTAL SYSTEM");
    console.log("==========================================");

    const totalCollateral = activeCollateral.add(defaultCollateral);
    const totalDebt = activeLUSDDebt.add(defaultLUSDDebt);
    console.log("Total System Collateral:", ethers.utils.formatEther(totalCollateral), "AR");
    console.log("Total System Debt:", ethers.utils.formatEther(totalDebt), "LUSD");

    console.log("\n5. SYSTEM STATS");
    console.log("==========================================");

    // Get number of troves
    const numberOfTroves = await TroveManager.getTroveOwnersCount();
    console.log("Number of Troves:", numberOfTroves.toString());

    // Get entire system stats (these should match our manual calculation)
    const entireSystemColl = await TroveManager.getEntireSystemColl();
    const entireSystemDebt = await TroveManager.getEntireSystemDebt();
    console.log("TroveManager.getEntireSystemColl():", ethers.utils.formatEther(entireSystemColl), "AR");
    console.log("TroveManager.getEntireSystemDebt():", ethers.utils.formatEther(entireSystemDebt), "LUSD");

    console.log("\n6. VERIFICATION");
    console.log("==========================================");

    if (totalCollateral.eq(entireSystemColl) && totalDebt.eq(entireSystemDebt)) {
      console.log("✅ Pool totals match TroveManager system totals");
    } else {
      console.log("❌ MISMATCH: Pool totals don't match TroveManager system totals");
      console.log("This indicates a problem with the protocol state");
    }

    if (totalCollateral.eq(0) && totalDebt.eq(0)) {
      console.log("❌ PROBLEM: Total system values are 0");
      console.log("This is why your frontend shows 0 total");
      if (troveStatus.toString() === "1") {
        console.log("But you have an active trove - there's a disconnect somewhere");
      }
    } else {
      console.log("✅ System has non-zero totals");
    }

  } catch (error) {
    console.error("Error debugging system:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });