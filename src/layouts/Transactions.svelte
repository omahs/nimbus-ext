<script lang="ts">
  import { onMount } from "svelte";
  // import { nimbus } from "~/lib/network";
  // import { user } from "~/store";
  import mixpanel from "mixpanel-browser";

  // import Button from "~/components/Button.svelte";
  // import Loading from "~/components/Loading.svelte";
  import ErrorBoundary from "~/components/ErrorBoundary.svelte";
  import Transactions from "~/UI/Transaction/Transactions.svelte";

  // let listNft = [];
  // let isLoading = false;

  // const handleBuy = async () => {
  //   const res = await nimbus
  //     .get("/payments/create-session")
  //     .then((response) => response);
  //   if (res) {
  //     window.location.replace(res.data.payment_url);
  //   }
  // };

  // const handleGetNft = async () => {
  //   try {
  //     isLoading = true;
  //     const solanaAddress = localStorage.getItem("solana_address");
  //     const solanaToken = localStorage.getItem("solana_token");
  //     if (solanaAddress && solanaToken) {
  //       const res = await nimbus
  //         .get(`/nft/${solanaAddress}`, {
  //           headers: {
  //             Authorization: `${solanaToken}`,
  //           },
  //         })
  //         .then((response) => response);
  //       if (res) {
  //         listNft = res?.data?.result;
  //       }
  //     }
  //   } catch (e) {
  //     console.error("error: ", e);
  //   } finally {
  //     isLoading = false;
  //   }
  // };

  // $: {
  //   if (Object.keys($user).length !== 0) {
  //     handleGetNft();
  //   } else {
  //     listNft = [];
  //   }
  // }

  onMount(() => {
    mixpanel.track("transaction_page");
  });
</script>

<ErrorBoundary>
  <!-- {#if Object.keys($user).length === 0}
    <div class="flex justify-center items-center h-screen">
      <div class="p-6 w-2/3 flex flex-col gap-4 justify-center items-center">
        <div class="text-lg">Please connect wallet to use this feature</div>
      </div>
    </div>
  {:else}
    <div>
      {#if isLoading}
        <div class="flex justify-center items-center h-screen">
          <div
            class="p-6 w-2/3 flex flex-col gap-4 justify-center items-center"
          >
            <Loading />
          </div>
        </div>
      {:else}
        <div>
          {#if listNft && listNft.length !== 0}
            <div
              class="flex justify-between items-center max-w-[2000px] m-auto w-[90%]"
            >
              Already have NFT
            </div>
          {:else}
            <div class="flex justify-center items-center h-screen">
              <div
                class="p-6 w-2/3 flex flex-col gap-4 justify-center items-center"
              >
                <div class="text-lg">
                  You need Nimbus NFT to unlock this feature
                </div>
                <Button variant="secondary" on:click={() => handleBuy()}
                  >Buy</Button
                >
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if} -->
  <Transactions />
</ErrorBoundary>

<style></style>
