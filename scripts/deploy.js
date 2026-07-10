async function main() {
  const [deployer] = await ethers.getSigners();

  // ✅ Deploy Token
  const Token = await ethers.getContractFactory("CarbonCreditToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("Token deployed:", await token.getAddress());

  // ✅ Deploy Marketplace
  const Market = await ethers.getContractFactory("CarbonMarketplace");
  const market = await Market.deploy(await token.getAddress());
  await market.waitForDeployment();
  console.log("Marketplace deployed:", await market.getAddress());

  // ✅ Deploy Registry (NOW WITH 2 ARGUMENTS)
  const Registry = await ethers.getContractFactory("EmissionRegistry");
  const registry = await Registry.deploy(
    await token.getAddress(),
    await market.getAddress()   // 🔥 NEW
  );
  await registry.waitForDeployment();
  console.log("Registry deployed:", await registry.getAddress());

  // ✅ SET REGISTRY IN TOKEN
  await token.setRegistry(await registry.getAddress());
  console.log("Registry set in token");

  await market.setRegistry(await registry.getAddress());
  console.log("Registry set in marketplace");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});