import { ContractReceipt } from "ethers";
import { waffle } from "hardhat";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function getEvent(receipt: ContractReceipt, eventName: string) {
  if (!receipt.events) {
    return;
  }

  for (const ev of receipt.events) {
    if (ev.event == eventName) {
      return ev.args;
    }
  }

  return;
}

export async function advanceBlock(amount: number, durationInSec = 1) {
  const amountHex = "0x" + amount.toString(16);
  const durationHex = "0x" + durationInSec.toString(16);
  await waffle.provider.send("hardhat_mine", [amountHex, durationHex]);
}

export async function advanceBlockTo(number: number, durationInSec = 1) {
  const currBlockNumber = await waffle.provider.getBlockNumber();
  if (number > currBlockNumber) {
    await advanceBlock(number - currBlockNumber, durationInSec);
  }
}

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
