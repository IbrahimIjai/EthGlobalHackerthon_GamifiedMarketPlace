
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a contract named "YourToken" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("WETH9", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });


  console.log("moving forward...");
  
};

export default deployYourToken;

deployYourToken.tags = ["BoredApeYachtClub"];
