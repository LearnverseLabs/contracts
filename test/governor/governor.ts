import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, run } from "hardhat";

import { TimelockController } from "../../src/types/@openzeppelin/contracts/governance/TimelockController";
import { LEARN } from "../../src/types/contracts/LEARN";
import { LearnverseGovernor } from "../../src/types/contracts/LearnverseGovernor";
import { Signers } from "../types";
import { ShouldBehaveLikeProposalManager, shouldBehaveLikeGovernor } from "./governor.behavior";

describe("leanverse governor unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;
    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    [this.signers.alice, this.signers.bob, this.signers.carol, this.signers.devid] = signers.slice(1);
  });

  describe("Governor", function () {
    const InitialVotingDelay = ethers.BigNumber.from(1);
    const InitialVotingPeriod = ethers.BigNumber.from(6);
    const ProposalThreshold = ethers.utils.parseUnits("10", 18);

    const TimelockMinDelay = ethers.BigNumber.from(2);

    beforeEach(async function () {
      this.learnToken = <LEARN>(
        await run("deploy:LEARN", { initialAmount: ethers.utils.parseUnits("1000", 18).toString() })
      );
      const governor = <{ timelock: TimelockController; governor: LearnverseGovernor }>await run("deploy:governor", {
        votingDelay: InitialVotingDelay.toString(),
        votingPeriod: InitialVotingPeriod.toString(),
        proposalThreshold: ProposalThreshold.toString(),
        learn: this.learnToken.address,
        timelockMinDelay: TimelockMinDelay.toString(),
      });

      this.timelock = governor.timelock;
      this.governor = governor.governor;
    });

    shouldBehaveLikeGovernor(InitialVotingDelay, InitialVotingPeriod, ProposalThreshold);
    ShouldBehaveLikeProposalManager();
  });
});
