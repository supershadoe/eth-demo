import { BrowserProvider, type BigNumberish, type ContractTransactionResponse, Contract } from "ethers";
import { txnLock, contract, reloadPage } from "./stores";
import { get } from "svelte/store";
import { CONTRACT_ADDRESS } from "./consts";
import contractABI from "./abi.json";

/** productID, seller, buyer, rate, name, desc and delivery status resp. */
export type Product = [
    number,
    BigNumberish,
    BigNumberish,
    number,
    string,
    string,
    boolean
];

export async function getContract() {
    const contractObj = get(contract);
    if (contractObj) {
        return contractObj;
    }
    const newContractObj = await new BrowserProvider(ethereum)
        .getSigner()
        .then((signer) => new Contract(
            CONTRACT_ADDRESS, contractABI.abi, signer
        ));
    newContractObj.on('registered', () => reloadPage.update(_ => !_));
    newContractObj.on('bought', () => reloadPage.update(_ => !_));
    newContractObj.on('deleivery', () => reloadPage.update(_ => !_));
    contract.set(newContractObj);
    return newContractObj;
}

export async function getAllItems(): Promise<Product[]> {
    return await getContract().then(c => c.listProducts());
}

export async function registerItem(e: SubmitEvent) {
    let result = null;
    if (! get(txnLock)) {
        const formData = new FormData(e.target as HTMLFormElement);
        const costField = formData.get('costField');
        const nameField = formData.get('nameField');
        const descField = formData.get('descField');
        if (costField && nameField && descField) {
            txnLock.set(true);
            result = await getContract()
                .then(c => c.register(costField, nameField, descField))
                .then(
                    (txn: ContractTransactionResponse) => txn.wait(),
                    _ => console.info('Rejected transaction.')
                );
            txnLock.set(false);
        }
        else
            console.error("Check if you've mentioned the proper form keys.");
    }
    return Boolean(result);
}

export async function buyItem(id: BigNumberish) {
    if (! get(txnLock)) {
        txnLock.set(true);
        const cont = await getContract()
        cont.quotePrice(id)
            .then((price: BigNumberish) => cont.buy(id, {value: price}))
            .then((txn: ContractTransactionResponse) => txn.wait())
            .then(receipt => {
                if (receipt) return cont.deleivered(id);
                else Promise.reject();
            })
            .then(
                (txn: ContractTransactionResponse) => txn.wait(),
                _ => console.info("Transaction resolved to null.")
            );
        txnLock.set(false);
    }
}
