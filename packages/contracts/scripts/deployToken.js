async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const TestToken = await ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy(deployer.address);

  console.log("TestToken deployed to:", testToken.address);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
