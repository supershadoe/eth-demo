import { writable } from "svelte/store";

export const txnLock = writable(false);
