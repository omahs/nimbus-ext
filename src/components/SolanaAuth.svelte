<script lang="ts">
  import { walletStore } from "@svelte-on-solana/wallet-adapter-core";

  import WalletButton from "~/UI/SolanaCustomWalletBtn/WalletButton.svelte";
  import WalletConnectButton from "~/UI/SolanaCustomWalletBtn/WalletConnectButton.svelte";
  import WalletModal from "~/UI/SolanaCustomWalletBtn/WalletModal.svelte";

  import "~/UI/SolanaCustomWalletBtn/style.css";

  import SolanaIcon from "~/assets/solana.png";

  export let maxNumberOfWallets = 3;

  $: ({ publicKey, wallet, disconnect, connect, select } = $walletStore);

  let dropDrownVisible = false,
    modalVisible = false,
    copied = false;

  $: base58 = publicKey && publicKey?.toBase58();
  $: content = showAddressContent($walletStore);

  const copyAddress = async () => {
    if (!base58) return;
    await navigator.clipboard.writeText(base58);
    copied = true;
    setTimeout(() => (copied = false), 400);
  };

  const openDropdown = () => (dropDrownVisible = true);
  const closeDropdown = () => (dropDrownVisible = false);
  const openModal = () => {
    modalVisible = true;
    closeDropdown();
  };
  const closeModal = () => (modalVisible = false);

  function showAddressContent(store) {
    const base58 = store.publicKey?.toBase58();
    if (!store.wallet || !base58) return null;
    return base58.slice(0, 4) + ".." + base58.slice(-4);
  }

  async function connectWallet(event) {
    closeModal();
    await select(event.detail);
    await connect();
  }

  async function disconnectWallet(event) {
    closeDropdown();
    await disconnect();
  }

  interface CallbackType {
    (arg?: string): void;
  }

  function clickOutside(
    node: HTMLElement,
    callbackFunction: CallbackType
  ): unknown {
    function onClick(event: MouseEvent) {
      if (
        node &&
        event.target instanceof Node &&
        !node.contains(event.target) &&
        !event.defaultPrevented
      ) {
        callbackFunction();
      }
    }

    document.body.addEventListener("click", onClick, true);

    return {
      update(newCallbackFunction: CallbackType) {
        callbackFunction = newCallbackFunction;
      },
      destroy() {
        document.body.removeEventListener("click", onClick, true);
      },
    };
  }
</script>

{#if !wallet}
  <WalletButton class="wallet-adapter-button-trigger" on:click={openModal}>
    <slot>
      <div style="display: flex; align-items: center; gap: 8px">
        <img
          src={SolanaIcon}
          alt=""
          style="width: 24px; height: 24px; border-radius: 100%"
        />
        Login with Solana
      </div>
    </slot>
  </WalletButton>
{:else if !base58}
  <WalletConnectButton />
{:else}
  <div class="wallet-adapter-dropdown">
    <WalletButton on:click={openDropdown} class="wallet-adapter-button-trigger">
      <svelte:fragment slot="start-icon">
        <img src={wallet.icon} alt={`${wallet.name} icon`} />
      </svelte:fragment>
      {content}
    </WalletButton>
    {#if dropDrownVisible}
      <ul
        aria-label="dropdown-list"
        class="wallet-adapter-dropdown-list wallet-adapter-dropdown-list-active"
        role="menu"
        use:clickOutside={() => {
          if (dropDrownVisible) {
            closeDropdown();
          }
        }}
      >
        <li
          on:click={copyAddress}
          class="wallet-adapter-dropdown-list-item"
          role="menuitem"
        >
          {copied ? "Copied" : "Copy address"}
        </li>
        <li
          on:click={openModal}
          class="wallet-adapter-dropdown-list-item"
          role="menuitem"
        >
          Connect a different wallet
        </li>
        <li
          on:click={disconnectWallet}
          class="wallet-adapter-dropdown-list-item"
          role="menuitem"
        >
          Disconnect
        </li>
      </ul>
    {/if}
  </div>
{/if}

{#if modalVisible}
  <WalletModal
    on:close={closeModal}
    on:connect={connectWallet}
    {maxNumberOfWallets}
  />
{/if}

<style></style>
