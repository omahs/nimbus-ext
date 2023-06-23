<script lang="ts">
  import { onMount } from "svelte";
  import { priceSubscribe } from "~/lib/price-ws";
  import { i18n } from "~/lib/i18n";

  export let holdingTokenData;
  export let holdingNFTData;
  export let isLoadingToken;
  export let isLoadingNFT;
  export let totalAssets;
  export let selectedWallet;

  let filteredHoldingToken = true;
  let filteredHoldingDataToken = [];
  let marketPriceToken;
  let marketPriceNFT;
  let formatData = [];
  let formatDataNFT = [];
  let sumTokens = 0;
  let sumNFT = 0;
  let tableTokenHeader;
  let isStickyTableToken = false;
  let tableNFTHeader;
  let isStickyTableNFT = false;

  import HoldingToken from "~/components/HoldingToken.svelte";
  import HoldingNFT from "~/components/HoldingNFT.svelte";
  import ErrorBoundary from "~/components/ErrorBoundary.svelte";
  import TooltipTitle from "~/components/TooltipTitle.svelte";
  import TooltipNumber from "~/components/TooltipNumber.svelte";
  import "~/components/Loading.custom.svelte";

  const MultipleLang = {
    holding: i18n("newtabPage.holding", "Holding"),
    token: i18n("newtabPage.token", "Tokens"),
    nft: i18n("newtabPage.nft", "NFTs"),
    assets: i18n("newtabPage.assets", "Assets"),
    price: i18n("newtabPage.price", "Price"),
    amount: i18n("newtabPage.amount", "Amount"),
    value: i18n("newtabPage.value", "Value"),
    profit: i18n("newtabPage.profit", "Profit & Loss"),
    total_spent: i18n("newtabPage.total_spent", "Total Spent"),
    collection: i18n("newtabPage.collection", "Collection"),
    floor_price: i18n("newtabPage.floor_price", "Floor Price"),
    current_value: i18n("newtabPage.current_value", "Current Value"),
    Balance: i18n("newtabPage.Balance", "Balance"),
    hide: i18n("newtabPage.hide-less-than-1", "Hide tokens less than $1"),
    empty: i18n("newtabPage.empty", "Empty"),
  };

  onMount(() => {
    const handleScroll = () => {
      const clientRectTokenHeader = tableTokenHeader.getBoundingClientRect();
      isStickyTableToken = clientRectTokenHeader.top <= 0;
      const clientRectNFTHeader = tableNFTHeader.getBoundingClientRect();
      isStickyTableNFT = clientRectNFTHeader.top <= 0;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  $: {
    if (holdingTokenData) {
      holdingTokenData.map((item) => {
        priceSubscribe([item?.cmc_id], (data) => {
          marketPriceToken = {
            id: data.id,
            market_price: data.p,
          };
        });
      });
    }
    if (holdingNFTData) {
      holdingNFTData.map((item) => {
        priceSubscribe([item?.cmc_id], (data) => {
          marketPriceNFT = {
            id: data.id,
            market_price: data.p,
          };
        });
      });
    }
  }

  $: {
    if (holdingTokenData) {
      formatData = holdingTokenData.map((item) => {
        return {
          ...item,
          market_price: item?.rate || 0,
        };
      });
      filteredHoldingDataToken = formatData.filter((item) => item.value > 1);
      sumTokens = holdingTokenData.reduce((prev, item) => prev + item.value, 0);
    }
    if (holdingNFTData) {
      formatDataNFT = holdingNFTData
        .map((item) => {
          return {
            ...item,
            market_price: item?.btcPrice || 0,
            current_value: item?.floorPriceBTC * item?.btcPrice * item?.balance,
          };
        })
        .sort((a, b) => {
          if (a.current_value < b.current_value) {
            return 1;
          }
          if (a.current_value > b.current_value) {
            return -1;
          }
          return 0;
        });
      sumNFT = formatDataNFT.reduce(
        (prev, item) => prev + item.current_value,
        0
      );
    }
  }

  $: {
    if (marketPriceToken) {
      const formatDataWithMarketPrice = formatData.map((item) => {
        if (marketPriceToken.id === item.cmc_id) {
          return {
            ...item,
            market_price: marketPriceToken.market_price,
          };
        }
        return { ...item };
      });
      formatData = formatDataWithMarketPrice;
    }
    if (marketPriceNFT) {
      const formatDataWithMarketPrice = formatDataNFT.map((item) => {
        if (marketPriceNFT.id === item.cmc_id) {
          return {
            ...item,
            market_price: marketPriceNFT.market_price,
            current_value:
              item?.floorPriceBTC * marketPriceNFT.market_price * item?.balance,
          };
        }
        return { ...item };
      });
      formatDataNFT = formatDataWithMarketPrice;
    }
  }

  $: {
    if (filteredHoldingToken) {
      filteredHoldingDataToken = formatData.filter(
        (item) => item?.amount * item.market_price > 1
      );
    } else {
      filteredHoldingDataToken = formatData;
    }
  }

  $: {
    if (formatData.length === 0) {
      totalAssets = 0;
      sumTokens = 0;
    } else {
      sumTokens = (formatData || []).reduce(
        (prev, item) => prev + item?.amount * item.market_price,
        0
      );
    }
  }

  $: {
    if (formatDataNFT.length === 0) {
      sumNFT = 0;
    } else {
      sumNFT = (formatDataNFT || []).reduce(
        (prev, item) => prev + item?.current_value,
        0
      );
    }
  }

  $: totalAssets = sumTokens + sumNFT;
</script>

<div class="flex flex-col gap-6 border border-[#0000001a] rounded-[20px] p-6">
  <ErrorBoundary>
    <div class="flex items-end gap-3">
      <div class="text-2xl font-medium text-black">
        {MultipleLang.holding}
      </div>
      <a
        href="https://forms.gle/HfmvSTzd5frPPYDz8"
        target="_blank"
        class="text-sm font-normal text-blue-500 mb-[2px] hover:text-blue-700 transition-all"
      >
        Get investment opportunities notification
      </a>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <div class="text-xl font-medium text-black">
          {MultipleLang.token}
        </div>
        <div class="text-3xl font-semibold text-right">
          $<TooltipNumber number={sumTokens} type="balance" />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-end gap-2">
          <label class="text-sm font-regular text-gray-400" for="filter-value"
            >{MultipleLang.hide}
          </label>
          <input
            type="checkbox"
            id="filter-value"
            bind:checked={filteredHoldingToken}
            class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:outline-none focus:ring-0 dark:focus:outline-none dark:focus:ring-0 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div class="border border-[#0000000d] rounded-[10px]">
          <table class="table-auto w-full">
            <thead
              class={isStickyTableToken ? "sticky top-0 z-10" : ""}
              bind:this={tableTokenHeader}
            >
              <tr class="bg-[#f4f5f8]">
                <th class="pl-3 py-3">
                  <div
                    class="text-left text-xs uppercase font-semibold text-black"
                  >
                    {MultipleLang.assets}
                  </div>
                </th>
                <th class="py-3">
                  <div
                    class="text-right text-xs uppercase font-semibold text-black"
                  >
                    {MultipleLang.price}
                  </div>
                </th>
                <th class="py-3">
                  <div
                    class="text-right text-xs uppercase font-semibold text-black"
                  >
                    {MultipleLang.amount}
                  </div>
                </th>
                <th class="py-3">
                  <div
                    class="text-right text-xs uppercase font-semibold text-black"
                  >
                    {MultipleLang.value}
                  </div>
                </th>
                <th class="py-3">
                  <div class="text-xs uppercase font-semibold text-black">
                    <TooltipTitle
                      tooltipText="Profit and loss is calculated by transactions that swap the tokens"
                    >
                      {MultipleLang.profit}
                    </TooltipTitle>
                  </div>
                </th>
                <th class="py-3 w-10" />
              </tr>
            </thead>
            {#if isLoadingToken}
              <tbody>
                <tr>
                  <td colspan={6}>
                    <div class="flex justify-center items-center py-3 px-3">
                      <loading-icon />
                    </div>
                  </td>
                </tr>
              </tbody>
            {:else}
              <tbody>
                {#if filteredHoldingDataToken && filteredHoldingDataToken.length === 0}
                  <tr>
                    <td colspan={6}>
                      <div
                        class="flex justify-center items-center py-3 px-3 text-lg text-gray-400"
                      >
                        {MultipleLang.empty}
                      </div>
                    </td>
                  </tr>
                {:else}
                  {#each filteredHoldingDataToken as holding}
                    <HoldingToken data={holding} {selectedWallet} />
                  {/each}
                {/if}
              </tbody>
            {/if}
          </table>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <div class="text-xl font-medium text-black">
          {MultipleLang.nft}
        </div>
        <div class="text-3xl font-semibold text-right">
          $<TooltipNumber number={sumNFT} type="balance" />
        </div>
      </div>
      <div class="border border-[#0000000d] rounded-[10px]">
        <table class="table-auto w-full">
          <thead
            class={isStickyTableNFT ? "sticky top-0 z-10" : ""}
            bind:this={tableNFTHeader}
          >
            <tr class="bg-[#f4f5f8]">
              <th class="pl-3 py-3">
                <div
                  class="text-left text-xs uppercase font-semibold text-black"
                >
                  {MultipleLang.collection}
                </div>
              </th>
              <th class="py-3">
                <div
                  class="text-left text-xs uppercase font-semibold text-black"
                >
                  {MultipleLang.Balance}
                </div>
              </th>
              <th class="py-3">
                <div
                  class="text-right text-xs uppercase font-semibold text-black"
                >
                  {MultipleLang.floor_price}
                </div>
              </th>
              <th class="py-3">
                <div
                  class="text-right text-xs uppercase font-semibold text-black"
                >
                  {MultipleLang.total_spent}
                </div>
              </th>
              <th class="py-3">
                <div
                  class="text-right text-xs uppercase font-semibold text-black"
                >
                  {MultipleLang.current_value}
                </div>
              </th>
              <th class="py-3">
                <div
                  class="text-right text-xs uppercase font-semibold text-black"
                >
                  <TooltipTitle
                    tooltipText="Price NFTs now - Price NFTs at time you spent"
                  >
                    {MultipleLang.profit}
                  </TooltipTitle>
                </div>
              </th>
              <th class="py-3 w-10" />
            </tr>
          </thead>
          {#if isLoadingNFT}
            <tbody>
              <tr>
                <td colspan={8}>
                  <div class="flex justify-center items-center py-3 px-3">
                    <loading-icon />
                  </div>
                </td>
              </tr>
            </tbody>
          {:else}
            <tbody>
              {#if formatDataNFT && formatDataNFT.length === 0}
                <tr>
                  <td colspan={8}>
                    <div
                      class="flex justify-center items-center py-3 px-3 text-lg text-gray-400"
                    >
                      {MultipleLang.empty}
                    </div>
                  </td>
                </tr>
              {:else}
                {#each formatDataNFT as holding}
                  <HoldingNFT data={holding} {selectedWallet} />
                {/each}
              {/if}
            </tbody>
          {/if}
        </table>
      </div>
    </div>
  </ErrorBoundary>
</div>

<style>
</style>