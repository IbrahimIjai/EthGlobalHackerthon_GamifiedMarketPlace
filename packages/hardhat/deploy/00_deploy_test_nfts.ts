import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a contract named "YourToken" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("BoredApeYachtClub", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  await deploy("MiladyMaker", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
  await deploy("PuddyPenguine", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
  const boredApeYachtClub = await hre.ethers.getContract("BoredApeYachtClub", deployer);
  console.log("moving forward...");
  // await boredApeYachtClub.mint("0xce6E00103F6a0e804e0caF4cE0D128afa95820E9", 5);

  const totalSupply = await boredApeYachtClub.totalSupply();
  console.log("this is totalSupply", totalSupply.toString());
};

export default deployYourToken;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourToken
deployYourToken.tags = ["BoredApeYachtClub"];