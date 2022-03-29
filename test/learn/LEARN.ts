import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, run } from "hardhat";

import { LEARN } from "../../src/types/contracts/LEARN";
import { Signers } from "../types";
import { shouldBehaveLikeTokenBurn, shouldBehaveLikeTokenMint } from "./LEARN.behavior";

describe("learn unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    [this.signers.alice, this.signers.bob, this.signers.carol, this.signers.devid] = signers.slice(1);
  });

  describe("LEARN", function () {
    beforeEach(async function () {
      this.learnToken = <LEARN>(
        await run("deploy:LEARN", { initialAmount: ethers.utils.parseUnits("1000", 18).toString() })
      );
    });

    shouldBehaveLikeTokenBurn(ethers.utils.parseUnits("10", 18));
    shouldBehaveLikeTokenMint(ethers.utils.parseUnits("10", 18));
  });
});
