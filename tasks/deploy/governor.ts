import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { TimelockController } from "../../src/types/@openzeppelin/contracts/governance/TimelockController";
import { LearnverseGovernor } from "../../src/types/contracts/LearnverseGovernor";
import { TimelockController__factory } from "../../src/types/factories/@openzeppelin/contracts/governance/TimelockController__factory";
import { LearnverseGovernor__factory } from "../../src/types/factories/contracts/LearnverseGovernor__factory";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

task("deploy:governor")
  .addParam("votingDelay", "initial voting delay in block")
  .addParam("votingPeriod", "initial voting period in block")
  .addParam("proposalThreshold", "initial proposal threshold in block")
  .addParam("learn", "LEARN token address")
  .addParam("timelockMinDelay", "min delay for timelock")
  .setAction(async function (taskArguments: TaskArguments, { ethers, waffle }) {
    const [admin] = waffle.provider.getWallets();
    const nonce = await waffle.provider.getTransactionCount(admin.address);
    const timelockAddr = ethers.utils.getContractAddress({ from: admin.address, nonce: nonce });
    const governorAddr = ethers.utils.getContractAddress({ from: admin.address, nonce: nonce + 1 });

    const timelockFactory = <TimelockController__factory>await ethers.getContractFactory("TimelockController");
    const timelock = <TimelockController>await timelockFactory.deploy(
      taskArguments.timelockMinDelay,
      [governorAddr], // proposers
      [ZERO_ADDRESS], // executors
    );

    await timelock.deployed();
    console.log("Timelock deployed to: ", timelock.address);

    const governorFactory = <LearnverseGovernor__factory>await ethers.getContractFactory("LearnverseGovernor");
    const governor = <LearnverseGovernor>(
      await governorFactory.deploy(
        taskArguments.votingDelay,
        taskArguments.votingPeriod,
        taskArguments.proposalThreshold,
        taskArguments.learn,
        timelockAddr,
      )
    );
    await governor.deployed();
    console.log("Governor deployed to: ", governor.address);

    return {
      timelock: await timelock.deployed(),
      governor: await governor.deployed(),
    };
  });
