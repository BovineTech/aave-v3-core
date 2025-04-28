import { POOL_ADMIN } from "../../deployHelpers/constants";
import { ePolygonNetwork } from "../../deployHelpers/types";
import { FORK } from "../../deployHelpers/hardhat-config-helpers";
import { waitForTx } from "../../deployHelpers/utilities/tx";
import { getOwnableContract } from "../../deployHelpers/contract-getters";
import { task } from "hardhat/config";
import { isAddress } from "ethers/lib/utils";

task(`transfer-ownership`)
  .addParam("address")
  .addOptionalParam("admin")
  .setAction(async ({ address, admin }, hre) => {
    const network = FORK || hre.network.name;
    let owner = POOL_ADMIN[network];

    if (isAddress(admin)) {
      owner = admin;
    }

    const contract = await getOwnableContract(address);
    const currentOwner = await contract.owner();
    if (currentOwner == owner) {
      console.log(`- Owner of ${address} is already ${owner}`);
    } else {
      await waitForTx(await contract.transferOwnership(owner));
      const newOwner = await contract.owner();
      console.log(`- Changed owner from ${currentOwner} to ${newOwner}`);
    }
  });

