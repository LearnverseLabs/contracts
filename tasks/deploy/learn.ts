import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { LEARN } from "../../src/types/contracts/LEARN";
import { LEARN__factory } from "../../src/types/factories/contracts/LEARN__factory";

task("deploy:LEARN")
  .addParam("initialAmount", "initial amount to mint")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const learnFactory: LEARN__factory = <LEARN__factory>await ethers.getContractFactory("LEARN");
    const learn = <LEARN>await learnFactory.deploy(taskArguments.initialAmount);
    await learn.deployed();
    console.log("LEARN deployed to: ", learn.address);
    return learn.deployed();
  });
