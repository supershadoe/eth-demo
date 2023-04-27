import type { BigNumberish, Contract } from "ethers";
import { writable, type Writable } from "svelte/store";

export const txnLock = writable(false);
export const reloadPage = writable(false);
export const accountID: Writable<BigNumberish> = writable("0x0");
export const contract: Writable<Contract | undefined> = writable(undefined);
