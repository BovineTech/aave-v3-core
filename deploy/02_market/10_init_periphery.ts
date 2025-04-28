import {
  ConfigNames,
  loadPoolConfig,
} from "../../deployHelpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../deployHelpers/env";
import { V3_PERIPHERY_VERSION } from "../../deployHelpers/constants";
import {
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_PROXY_ID,
} from "../../deployHelpers/deploy-ids";
import { checkRequiredEnvironment as checkRequiredEnvironment } from "../../deployHelpers/market-config-helpers";
import { eNetwork } from "../../deployHelpers/types";
import { MARKET_NAME } from "../../deployHelpers/env";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);
  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;

  // Deploy Mock Flash Loan Receiver if testnet deployment
  if (!hre.config.networks[network].live || poolConfig.TestnetMarket) {
    await deploy("MockFlashLoanReceiver", {
      from: deployer,
      args: [await (await deployments.get(POOL_ADDRESSES_PROVIDER_ID)).address],
      ...COMMON_DEPLOY_PARAMS,
    });
  }

  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `PeripheryInit:${MARKET_NAME}:aave-v3-periphery@${V3_PERIPHERY_VERSION}`;

func.tags = ["market", "init-periphery"];

func.dependencies = [
  "before-deploy",
  "core",
  "periphery-pre",
  "provider",
  "init-pool",
  "oracles",
];

func.skip = async () => checkRequiredEnvironment();

export default func;

