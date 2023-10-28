import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployGeneralMarket: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("GeneralMarket", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract
  const generalMarket = await hre.ethers.getContract("GeneralMarket", deployer);
  const boredApeYachtClub = await hre.ethers.getContract("BoredApeYachtClub", deployer);
  // const totalSupply = await boredApeYachtClub.totalSupply();
  const addresss = await boredApeYachtClub.address;
  console.log("this is addresss", addresss, typeof addresss);
  await generalMarket.addCollection(
    addresss,
    "0x422315BB59A9eD6B2323E99353b126cCf8B987AB",
    2,
    hre.ethers.utils.parseEther("0.005"),
    hre.ethers.utils.parseEther("0.01"),
    2000,
  );
  console.log("finished", hre.ethers.utils.parseEther("0.005"));

  await generalMarket.transferOwnership("0x422315BB59A9eD6B2323E99353b126cCf8B987AB");
};

export default deployGeneralMarket;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployGeneralMarket.tags = ["GeneralMarket"];
