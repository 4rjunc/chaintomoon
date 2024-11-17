import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployChainPortalNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // const myToken = await hre.ethers.getContract<Contract>("MyToken", deployer);
  // const myTokenAddr = await myToken.getAddress();

  await deploy("ChainPortalNFT", {
    from: deployer,
    args: ["0xEDebFb8E05ED6eCcb2e41f5eDDa5Df7b317676e4"],
    log: true,
    autoMine: true,
  });
};

export default deployChainPortalNFT;

deployChainPortalNFT.tags = ["ChainPortalNFT"];
