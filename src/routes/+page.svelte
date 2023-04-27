<script lang="ts">
    import { onMount } from "svelte";
    import { accountID, reloadPage } from "$lib/stores";
    import type { BigNumberish } from "ethers";
    import { registerItem, getAllItems, buyItem } from "$lib/ethInterface";

    let noWallet = false;
    $: isConnected = $accountID !== "0x0";
    $: shldReloadPage = $reloadPage;

    onMount(function() {
        try {
            noWallet = !ethereum;
        } catch (e) {
            if (e instanceof ReferenceError)
                noWallet = true;
            else
                throw e;
        }
    });

    async function connectToWallet() {
        await ethereum.request({method: "eth_requestAccounts"})
            .then((accounts: BigNumberish[]) => {
                if (accounts[0]) {
                    $accountID = accounts[0];
                }
            });
    }
</script>

<svelte:head>
    <title>SASTRA Shop</title>
</svelte:head>

<section class="hero">
    <div class="hero-content">
        {#if !isConnected}
        <div class="max-w-2xl">
            <div class="text-4xl mb-4 font-bold">
                Connect your Metamask wallet <span aria-hidden=true>🦊</span>
            </div>
            <div class="text-2xl mb-8">
                To access the world of web3.
            </div>
            {#if noWallet}
            <div class="text-lg mb-8 italic">
                You don't seem to have Metamask installed. <a
                class="text-accent underline"
                href="https://metamask.io/download"
                >Get it here.</a>
            </div>
            {:else}
            <button class="btn btn-accent font-bold text-accent-content
                rounded-full px-8 py-4 shadow-lg uppercase tracking-wide mb-8"
                on:click={connectToWallet}>
                Connect
            </button>
            {/if}
        </div>
        {:else}
        {#key shldReloadPage}
        <div class="max-w-xl">
            {#await getAllItems()}
            <div class="text-xl">
                Getting list of products…
            </div>
            {:then items}
            <table class="table table-compact text-center">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th class="px-8 mx-4 my-2">Price (wei = 10<sup>-18</sup> eth)</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {#each items as item, i}
                    {#if !item[6]}
                    <tr>
                        <td class="text-lg">{item[4]}</td>
                        <td class="text-lg">{item[5]}</td>
                        <td class="text-lg">{item[3]}</td>
                        <td><button class="px-8 mx-4 my-2 btn btn-primary rounded-2xl tracking-widest" on:click={() => buyItem(i+1)}>BUY</button></td>
                    </tr>
                    {/if}
                    {/each}
                </tbody>
            </table>
            {/await}
        </div>
        <div class="max-w-xl mx-20">
            <div class="text-2xl mb-4">
                <form class="form-control"
                    on:submit|preventDefault={registerItem}>
                    <label for="nameField" class="label">
                        <span class="label-text font-bold">Name</span>
                    </label>
                    <input name="nameField" id="nameField" type="text"
                    placeholder="Name" class="rounded-xl input input-bordered
                    hover:input-accent w-full max-w-xs mb-4" required />
                    <label for="costField" class="label">
                        <span class="label-text font-bold">Cost</span>
                    </label>
                    <input name="costField" id="costField" type="number"
                    min="1" step="any" placeholder="Cost" class="rounded-xl
                    input input-bordered hover:input-accent w-full max-w-xs mb-4"
                    required />
                    <label for="descField" class="label">
                        <span class="label-text font-bold">Description</span>
                    </label>
                    <input name="descField" id="descField" type="text"
                    placeholder="Description" class="rounded-xl input
                    input-bordered hover:input-accent w-full max-w-xs mb-6" required
                    />
                    <button class="btn btn-accent font-bold text-accent-content
                    rounded-full px-8 py-4 shadow-lg uppercase tracking-wide
                    mb-8" type="submit">
                        Add item
                    </button>
                </form>
            </div>
        </div>
        {/key}
        {/if}
    </div>
</section>
