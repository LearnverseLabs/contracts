import { expect, use } from "chai";
import { ethers } from "ethers";
import { waffle } from "hardhat";

import { advanceBlock, advanceBlockTo, getEvent, sleep } from "../utils";

use(waffle.solidity);

export function shouldBehaveLikeGovernor(
  votingDelay: ethers.BigNumber,
  votingPeriod: ethers.BigNumber,
  proposalThreshold: ethers.BigNumber,
): void {
  it("Should be equal voting delay", async function () {
    expect(await this.governor.votingDelay()).to.be.equal(votingDelay);
  });

  it("Should be equal voting period", async function () {
    expect(await this.governor.votingPeriod()).to.be.equal(votingPeriod);
  });

  it("Should be equal proposalThreshold", async function () {
    expect(await this.governor.proposalThreshold()).to.be.equal(proposalThreshold);
  });

  it("Should be equal quorum", async function () {
    expect(await this.governor.quorumNumerator()).to.be.equal(ethers.BigNumber.from(4));
  });
}

export function ShouldBehaveLikeProposalManager(): void {
  it("Workflow", async function () {
    // Transfer some ethers to timelock
    await this.signers.admin.sendTransaction({ to: this.timelock.address, value: ethers.utils.parseEther("50") });

    // Transfers
    await this.learnToken.transfer(this.signers.alice.address, ethers.utils.parseUnits("100", 18));
    await this.learnToken.transfer(this.signers.bob.address, ethers.utils.parseUnits("100", 18));
    await this.learnToken.transfer(this.signers.carol.address, ethers.utils.parseUnits("100", 18));
    await this.learnToken.transfer(this.signers.devid.address, ethers.utils.parseUnits("100", 18));

    // Self-delegates
    await this.learnToken.connect(this.signers.admin).delegate(this.signers.admin.address);
    await this.learnToken.connect(this.signers.alice).delegate(this.signers.alice.address);
    await this.learnToken.connect(this.signers.bob).delegate(this.signers.bob.address);
    await this.learnToken.connect(this.signers.carol).delegate(this.signers.carol.address);
    await this.learnToken.connect(this.signers.devid).delegate(this.signers.devid.address);

    const targets = [this.signers.alice.address];
    const values = [ethers.utils.parseEther("1")];
    const calldatas = ["0x"];
    const description = "Test Proposal";

    const proposalId = await this.governor.callStatic.propose(targets, values, calldatas, description);
    const proposalReceipt = await (await this.governor.propose(targets, values, calldatas, description)).wait();
    const proposalCreatedEvent = <ethers.utils.Result>getEvent(proposalReceipt, "ProposalCreated");
    expect(proposalCreatedEvent.proposalId).to.be.equal(proposalId);
    await advanceBlockTo(proposalCreatedEvent.startBlock);

    // Cast a vote
    // TODO: fix hard-code.
    await this.governor.castVote(proposalId, 1); // Cast for votes

    await advanceBlockTo(proposalCreatedEvent.endBlock);
    await advanceBlock(1);
    expect(await this.governor.state(proposalId)).to.be.equal(4); // Succeeded

    // Queue the proposal
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(description));
    await this.governor.queue(targets, values, calldatas, descriptionHash);

    const minDalay = await this.timelock.getMinDelay();
    await sleep(minDalay.toNumber() * 1000);

    // Execute the proposal
    expect(await this.governor.execute(targets, values, calldatas, descriptionHash))
      .to.be.changeEtherBalance(this.timelock.address, ethers.utils.parseEther("1"))
      .to.be.changeEtherBalance(this.signers.alice.address, ethers.utils.parseEther("1"));
  });
}
