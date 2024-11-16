import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployChainPortalNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("MyToken", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deployChainPortalNFT;

deployChainPortalNFT.tags = ["ChainPortalNFT"];
