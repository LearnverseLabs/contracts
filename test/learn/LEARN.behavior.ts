import { expect, use } from "chai";
import { ethers } from "ethers";
import { waffle } from "hardhat";

import { ZERO_ADDRESS } from "../utils";

use(waffle.solidity);

export function shouldBehaveLikeTokenBurn(burnAmount: ethers.BigNumber): void {
  it("Should burn given amount token to zero address", async function () {
    expect(this.learnToken.burn(burnAmount))
      .to.emit(this.learnToken, "Transfer")
      .withArgs(this.signers.admin.address, ZERO_ADDRESS, burnAmount);
  });
}

export function shouldBehaveLikeTokenMint(mintAmount: ethers.BigNumber): void {
  it("Should mint given amount token to from address", async function () {
    expect(await this.learnToken.mint(this.signers.admin.address, mintAmount))
      .to.emit(this.learnToken, "Transfer")
      .withArgs(ZERO_ADDRESS, this.signers.admin.address, mintAmount);
  });

  it("Should not mint given amount token without ownership", async function () {
    expect(this.learnToken.connect(this.signers.alice).mint(this.signers.alice.address, mintAmount)).to.be.revertedWith(
      "Ownable: caller is not the owner",
    );
  });
}
