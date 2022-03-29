import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";

import { TimelockController } from "../src/types/@openzeppelin/contracts/governance/TimelockController";
import type { Greeter } from "../src/types/contracts/Greeter";
import { LEARN } from "../src/types/contracts/LEARN";
import { LearnverseGovernor } from "../src/types/contracts/LearnverseGovernor";

declare module "mocha" {
  export interface Context {
    greeter: Greeter;
    learnToken: LEARN;
    governor: LearnverseGovernor;
    timelock: TimelockController;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress; // Usualy admin is a deployer of contracts.
  // Ususaly these signers are users which call deployed contracts.
  alice: SignerWithAddress;
  bob: SignerWithAddress;
  carol: SignerWithAddress;
  devid: SignerWithAddress;
  // Potential users are here.
  [user: string]: SignerWithAddress | undefined | null;
}
