import type { Eip1193Provider } from 'ethers';

declare global {
    var ethereum: Eip1193Provider;
}

export {};
