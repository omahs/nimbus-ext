<script lang="ts">
  import { onMount } from "svelte";
  import { priceSubscribe } from "~/lib/price-ws";
  import { i18n } from "~/lib/i18n";
  import { getAddressContext } from "~/utils";
  import { chain, typeWallet, isDarkMode } from "~/store";

  export let holdingTokenData;
  export let holdingNFTData;
  export let isLoadingToken;
  export let isLoadingNFT;
  export let selectedWallet;

  import ClosedHoldingTokenPosition from "~/components/ClosedHoldingTokenPosition.svelte";
  import HoldingNFT from "~/components/HoldingNFT.svelte";
  import ErrorBoundary from "~/components/ErrorBoundary.svelte";
  import TooltipTitle from "~/components/TooltipTitle.svelte";
  import TooltipNumber from "~/components/TooltipNumber.svelte";
  import "~/components/Loading.custom.svelte";

  let filteredHoldingToken = true;
  let filteredHoldingDataToken = [];
  let marketPriceToken;
  let marketPriceNFT;
  let formatData = [];
  let formatDataNFT = [];
  let sumAllTokens = 0;
  let sumNFT = 0;
  let tableTokenHeader;
  let isStickyTableToken = false;
  let tableNFTHeader;
  let isStickyTableNFT = false;

  let darkMode = false;
  isDarkMode.subscribe((value) => {
    darkMode = value;
  });

  let selectedChain: string = "";
  chain.subscribe((value) => {
    selectedChain = value;
  });

  let typeWalletAddress: string = "";
  typeWallet.subscribe((value) => {
    typeWalletAddress = value;
  });

  const MultipleLang = {
    token_position: i18n("newtabPage.token_position", "Closed Positions"),
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
    hide_roi_token: i18n(
      "newtabPage.hide-token-has-roi-less-than-1",
      "Hide tokens has ROI less than $1"
    ),
    empty: i18n("newtabPage.empty", "Empty"),
  };

  onMount(() => {
    const handleScroll = () => {
      const clientRectTokenHeader = tableTokenHeader?.getBoundingClientRect();
      isStickyTableToken = clientRectTokenHeader?.top <= 0;
      const clientRectNFTHeader = tableNFTHeader?.getBoundingClientRect();
      isStickyTableNFT = clientRectNFTHeader?.top <= 0;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  // subscribe to ws
  $: {
    if (holdingTokenData?.length !== 0) {
      holdingTokenData?.map((item) => {
        priceSubscribe([item?.cmc_id], (data) => {
          marketPriceToken = {
            id: data.id,
            market_price: data.p,
          };
        });
      });
    }
    if (holdingNFTData) {
      holdingNFTData?.map((item) => {
        priceSubscribe([item?.cmc_id], (data) => {
          marketPriceNFT = {
            id: data.id,
            market_price: data.p,
          };
        });
      });
    }
  }

  // format initial data
  $: {
    if (holdingTokenData) {
      formatData = holdingTokenData
        ?.filter((item) => Number(item?.amount) === 0)
        ?.filter((item) => {
          if (item?.profit !== undefined) {
            return item?.profit.realizedProfit !== 0;
          }
        })
        ?.map((item) => {
          return {
            ...item,
            market_price: item?.rate || 0,
          };
        })
        .sort((a, b) => b?.profit.realizedProfit - a?.profit.realizedProfit);

      sumAllTokens = formatData.reduce(
        (prev, item) => prev + item?.profit.realizedProfit,
        0
      );

      filteredHoldingDataToken = formatData.filter(
        (item) => Math.abs(item?.profit.realizedProfit) > 1
      );
    }
    if (holdingNFTData) {
      formatDataNFT = holdingNFTData
        .map((item) => {
          return {
            ...item,
            market_price: item?.btcPrice || 0,
            current_value:
              item?.floorPriceBTC * item?.btcPrice * item?.balance || 0,
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

  // check market price and update price real-time
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

      filteredHoldingDataToken = formatData.filter(
        (item) => Math.abs(item?.profit.realizedProfit) > 1
      );

      sumAllTokens = formatData.reduce(
        (prev, item) => prev + item?.profit.realizedProfit,
        0
      );
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

  $: filteredHoldingDataToken = filteredHoldingToken
    ? formatData?.filter((item) => Math.abs(item?.profit.realizedProfit) > 1)
    : formatData;

  $: {
    if (formatData?.length === 0) {
      sumAllTokens = 0;
      sumNFT = 0;
    } else {
      sumAllTokens = (formatData || []).reduce(
        (prev, item) => prev + item?.profit.realizedProfit,
        0
      );
      sumNFT = (formatDataNFT || []).reduce(
        (prev, item) => prev + item?.current_value,
        0
      );
    }
  }

  $: colspan =
    typeWalletAddress === "DEX" &&
    getAddressContext(selectedWallet)?.type !== "EVM"
      ? 5
      : 4;

  $: {
    if (selectedWallet || selectedChain) {
      if (selectedWallet?.length !== 0 && selectedChain?.length !== 0) {
        sumAllTokens = 0;
        sumNFT = 0;
        formatData = [];
        formatDataNFT = [];
        filteredHoldingDataToken = [];
        marketPriceToken = undefined;
        marketPriceNFT = undefined;
      }
    }
  }
</script>

<div
  class={`flex flex-col gap-6 rounded-[20px] p-6 ${
    darkMode ? "bg-[#222222]" : "bg-[#fff] border border_0000001a"
  }`}
>
  <ErrorBoundary>
    <div class="flex items-end gap-3">
      <div class="xl:text-2xl text-4xl font-medium">
        {MultipleLang.token_position}
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <div class="xl:text-xl text-3xl font-medium">
            {MultipleLang.token}
          </div>
        </div>
        <div
          class={`xl:text-3xl text-4xl font-medium text-right flex text-green-500 ${
            sumAllTokens < 0 ? "text-red-500" : "text-green-500"
          } `}
        >
          {#if sumAllTokens < 0}-{/if}
          <TooltipNumber number={Math.abs(sumAllTokens)} type="value" />
        </div>
      </div>

      <!-- token holding table -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-end gap-2">
          <label
            class="xl:text-sm text-lg font-regular text-gray-400"
            for="filter-value"
            >{MultipleLang.hide_roi_token}
          </label>
          <input
            type="checkbox"
            id="filter-value"
            bind:checked={filteredHoldingToken}
            class="cursor-pointer relative xl:w-4 xl:h-4 w-6 h-6 appearance-none rounded-[0.25rem] border outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
          />
        </div>
        <div
          class={`rounded-[10px] xl:overflow-visible overflow-x-auto ${
            darkMode ? "bg-[#131313]" : "bg-[#fff] border border_0000000d"
          }`}
        >
          <table class="table-auto xl:w-full w-[1400px]">
            <thead
              class={isStickyTableToken ? "sticky top-0 z-10" : ""}
              bind:this={tableTokenHeader}
            >
              <tr class="bg_f4f5f8">
                <th
                  class="pl-3 py-3 rounded-tl-[10px] xl:static xl:bg-transparent sticky left-0 z-10 bg_f4f5f8 w-[420px]"
                >
                  <div
                    class="text-left xl:text-xs text-base uppercase font-medium"
                  >
                    {MultipleLang.assets}
                  </div>
                </th>
                <th class="py-3">
                  <div
                    class="text-right xl:text-xs text-base uppercase font-medium"
                  >
                    {MultipleLang.price}
                  </div>
                </th>
                <th class="py-3">
                  <div
                    class="text-right xl:text-xs text-base uppercase font-medium"
                  >
                    Average Cost
                  </div>
                </th>
                <th class="py-3 pr-3 rounded-tr-[10px] pr-3 rounded-tr-[10px]">
                  <div
                    class="text-right xl:text-xs text-base uppercase font-medium"
                  >
                    ROI
                  </div>
                </th>
                <!-- <th class="py-3 w-10 rounded-tr-[10px]" /> -->
              </tr>
            </thead>
            {#if isLoadingToken}
              <tbody>
                <tr>
                  <td {colspan}>
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
                    <td {colspan}>
                      <div
                        class="flex justify-center items-center py-3 px-3 xl:text-lg text-xl text-gray-400"
                      >
                        {#if holdingTokenData && holdingTokenData.length === 0}
                          {MultipleLang.empty}
                        {:else}
                          All tokens less than $1
                        {/if}
                      </div>
                    </td>
                  </tr>
                {:else}
                  {#each filteredHoldingDataToken as holding}
                    <ClosedHoldingTokenPosition
                      data={holding}
                      {selectedWallet}
                    />
                  {/each}
                {/if}
              </tbody>
            {/if}
          </table>
        </div>
      </div>
    </div>

    <!-- nft holding table -->
    {#if typeWalletAddress === "DEX" && getAddressContext(selectedWallet)?.type === "BTC"}
      <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <div class="xl:text-xl text-3xl font-medium">
            {MultipleLang.nft}
          </div>
          <div class="xl:text-3xl text-4xl font-medium text-right">
            <TooltipNumber number={sumNFT} type="value" />
          </div>
        </div>
        <div
          class="border border_0000000d rounded-[10px] xl:overflow-visible overflow-x-auto"
        >
          <table class="table-auto xl:w-full w-[1400px]">
            <thead
              class={isStickyTableNFT ? "sticky top-0 z-10" : ""}
              bind:this={tableNFTHeader}
            >
              <tr class="bg_f4f5f8">
                <th
                  class="pl-3 py-3 rounded-tl-[10px] xl:static xl:bg-transparent sticky left-0 z-10 bg_f4f5f8 w-[220px]"
                >
                  <div
                    class="text-left xl:text-xs text-base uppercase font-medium"
                  >
                    {MultipleLang.collection}
                  </div>
                </th>
                <th
                  class="py-3 xl:static xl:bg-transparent sticky left-[220px] z-10 bg_f4f5f8 w-[160px]"
                >
                  <div
                    class="text-left xl:text-xs text-base uppercase font-medium"
                  >
                    {MultipleLang.Balance}
                  </div>
                </th>
                <th class="py-3">
                  <div
                    class="text-right xl:text-xs text-base uppercase font-medium"
                  >
                    <TooltipTitle
                      tooltipText={getAddressContext(selectedWallet)?.type ===
                      "EVM"
                        ? "The Floor price of last 24h, if there is no volume, the floor price is 0"
                        : "The Floor price from Magic Eden marketplace. "}
                      link={getAddressContext(selectedWallet)?.type === "EVM"
                        ? ""
                        : "https://magiceden.io/ordinals"}
                    >
                      {MultipleLang.floor_price}
                    </TooltipTitle>
                  </div>
                </th>
                <th class="py-3">
                  <div
                    class="text-right xl:text-xs text-base uppercase font-medium"
                  >
                    {MultipleLang.total_spent}
                  </div>
                </th>
                <th class="py-3">
                  <div
                    class="text-right xl:text-xs text-base uppercase font-medium"
                  >
                    {MultipleLang.current_value}
                  </div>
                </th>
                <th
                  class={`py-3 pr-3 ${
                    getAddressContext(selectedWallet)?.type === "EVM"
                      ? "rounded-tr-[10px]"
                      : ""
                  }`}
                >
                  <div
                    class="text-right xl:text-xs text-base uppercase font-medium"
                  >
                    <TooltipTitle
                      tooltipText="Price NFTs now - Price NFTs at time you spent"
                    >
                      {MultipleLang.profit}
                    </TooltipTitle>
                  </div>
                </th>
                {#if typeWalletAddress === "DEX" && getAddressContext(selectedWallet)?.type !== "EVM"}
                  <th class="py-3 w-10 rounded-tr-[10px]" />
                {/if}
              </tr>
            </thead>
            {#if isLoadingNFT}
              <tbody>
                <tr>
                  <td {colspan}>
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
                    <td {colspan}>
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
    {/if}
  </ErrorBoundary>
</div>

<style>
</style>