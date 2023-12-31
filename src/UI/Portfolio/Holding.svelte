<script lang="ts">
  import { onMount } from "svelte";
  import { priceSubscribe } from "~/lib/price-ws";
  import { i18n } from "~/lib/i18n";
  import { chain, typeWallet, isDarkMode } from "~/store";
  import { filterTokenValueType } from "~/utils";
  import { groupBy } from "lodash";

  export let selectedTokenHolding;
  export let selectedDataPieChart;
  export let holdingTokenData;
  export let holdingNFTData;
  export let isLoadingToken;
  export let isLoadingNFT;
  export let totalAssets;
  export let selectedWallet;

  import Select from "~/components/Select.svelte";
  import HoldingToken from "~/components/HoldingToken.svelte";
  import HoldingNFT from "~/components/HoldingNFT.svelte";
  import ErrorBoundary from "~/components/ErrorBoundary.svelte";
  import TooltipTitle from "~/components/TooltipTitle.svelte";
  import TooltipNumber from "~/components/TooltipNumber.svelte";
  import Loading from "~/components/Loading.svelte";

  let filteredHoldingDataToken = [];
  let filteredHoldingDataNFT = [];
  let marketPriceToken;
  let marketPriceNFT;
  let formatData = [];
  let formatDataNFT = [];
  let sumTokens = 0;
  let sumAllTokens = 0;
  let sumNFT = 0;
  let tableTokenHeader;
  let isStickyTableToken = false;
  let tableNFTHeader;
  let isStickyTableNFT = false;

  let selectedTypeTable = {
    label: "",
    value: "",
  };

  let filterTokenType = {
    label: "$1",
    value: 1,
  };

  let filterNFTType = {
    label: "$1",
    value: 1,
  };

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

  $: {
    if (selectedTokenHolding && holdingTokenData?.length !== 0) {
      const filteredHoldingTokenData = holdingTokenData?.filter(
        (item) => item?.cmc_id
      );

      const filteredNullCmcHoldingTokenData = holdingTokenData?.filter(
        (item) => item?.cmc_id === null
      );

      const groupFilteredNullCmcHoldingTokenData = groupBy(
        filteredNullCmcHoldingTokenData,
        "chain"
      );

      const chainList = Object.keys(groupFilteredNullCmcHoldingTokenData);

      chainList.map((chain) => {
        groupFilteredNullCmcHoldingTokenData[chain].map((item) => {
          priceSubscribe([item?.contractAddress], true, chain, (data) => {
            marketPriceToken = {
              id: data.id,
              market_price: data.price,
            };
          });
        });
      });

      filteredHoldingTokenData?.map((item) => {
        priceSubscribe([item?.cmc_id], false, "", (data) => {
          marketPriceToken = {
            id: data.id,
            market_price: data.price,
          };
        });
      });

      sumAllTokens = holdingTokenData?.reduce(
        (prev, item) => prev + item.value,
        0
      );
    }
    if (holdingNFTData?.length !== 0) {
      holdingNFTData
        ?.filter((item) => item?.nativeToken?.cmcId)
        ?.map((item) => {
          priceSubscribe(
            [Number(item?.nativeToken?.cmcId)],
            false,
            "",
            (data) => {
              marketPriceNFT = {
                id: data.id,
                market_price: data.price,
              };
            }
          );
        });
    }
  }

  $: {
    if (
      selectedTokenHolding &&
      Object.keys(selectedTokenHolding).length !== 0 &&
      selectedTokenHolding.data.length !== 0
    ) {
      let data = [];
      if (selectedTypeTable && Object.keys(selectedTypeTable).length !== 0) {
        if (Array.isArray(selectedTokenHolding.data)) {
          data = selectedTokenHolding?.data.find(
            (item) => item.name === selectedTypeTable.value
          )?.data;
        } else {
          data = selectedTokenHolding.data.data;
        }
      }

      if (data && data.length !== 0) {
        formatData = data.map((item) => {
          return {
            ...item,
            market_price: item?.rate || 0,
          };
        });
        filteredHoldingDataToken = formatData.filter((item) => item.value > 1);
        sumTokens = data.reduce((prev, item) => prev + item.value, 0);
      }
    }
    if (holdingNFTData) {
      formatDataNFT = holdingNFTData
        .map((item) => {
          return {
            ...item,
            current_value:
              item?.floorPrice * item?.marketPrice * item?.tokens?.length,
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
        if (
          marketPriceToken?.id.toString().toLowerCase() ===
            item?.cmc_id?.toString().toLowerCase() ||
          marketPriceToken?.id.toString().toLowerCase() ===
            item?.contractAddress.toString().toLowerCase()
        ) {
          return {
            ...item,
            market_price: marketPriceToken.market_price,
            value: Number(item?.amount) * Number(marketPriceToken.market_price),
          };
        }
        return { ...item };
      });

      formatData = formatDataWithMarketPrice.sort((a, b) => {
        if (a.value < b.value) {
          return 1;
        }
        if (a.value > b.value) {
          return -1;
        }
        return 0;
      });

      filteredHoldingDataToken = formatData.filter((item) => item.value > 1);

      sumTokens = formatDataWithMarketPrice.reduce(
        (prev, item) => prev + item.value,
        0
      );

      sumAllTokens = formatDataWithMarketPrice.reduce(
        (prev, item) => prev + item.value,
        0
      );
    }
    if (marketPriceNFT) {
      const formatDataNFTWithMarketPrice = formatDataNFT.map((item) => {
        if (
          marketPriceNFT?.id.toString().toLowerCase() ===
          item?.nativeToken?.cmcId.toString().toLowerCase()
        ) {
          return {
            ...item,
            current_value:
              item?.floorPrice *
              marketPriceNFT.market_price *
              item?.tokens?.length,
          };
        }
        return { ...item };
      });
      formatDataNFT = formatDataNFTWithMarketPrice.sort((a, b) => {
        if (a.current_value < b.current_value) {
          return 1;
        }
        if (a.current_value > b.current_value) {
          return -1;
        }
        return 0;
      });
      sumNFT = formatDataNFTWithMarketPrice.reduce(
        (prev, item) => prev + item.current_value,
        0
      );
    }
  }

  $: {
    if (filterTokenType) {
      if (filterTokenType.value === 0) {
        filteredHoldingDataToken = formatData;
      } else {
        filteredHoldingDataToken = formatData?.filter(
          (item) => item?.amount * item.market_price > filterTokenType.value
        );
      }
    }
  }

  $: {
    if (filterNFTType) {
      if (filterNFTType.value === 0) {
        filteredHoldingDataNFT = formatDataNFT;
      } else {
        filteredHoldingDataNFT = formatDataNFT?.filter(
          (item) => item?.current_value > filterNFTType.value
        );
      }
    }
  }

  $: {
    if (formatData?.length === 0) {
      totalAssets = 0;
      sumTokens = 0;
      sumNFT = 0;
    } else {
      sumTokens = (formatData || []).reduce(
        (prev, item) => prev + item?.amount * item.market_price,
        0
      );
      sumNFT = (formatDataNFT || []).reduce(
        (prev, item) => prev + item?.current_value,
        0
      );
    }
  }

  $: {
    if (
      selectedTokenHolding &&
      Object.keys(selectedTokenHolding).length !== 0 &&
      selectedTokenHolding?.select.length === 0 &&
      (sumTokens || sumNFT)
    ) {
      totalAssets = sumNFT + sumTokens;
    }
  }

  $: colspan = $typeWallet === "SOL" || $typeWallet === "EVM" ? 8 : 7;

  $: {
    if (selectedWallet || $chain) {
      if (selectedWallet?.length !== 0 && $chain?.length !== 0) {
        sumTokens = 0;
        sumAllTokens = 0;
        sumNFT = 0;
        formatData = [];
        formatDataNFT = [];
        filteredHoldingDataToken = [];
        filteredHoldingDataNFT = [];
        marketPriceToken = undefined;
        marketPriceNFT = undefined;
      }
    }
  }

  $: {
    if (
      selectedTokenHolding &&
      Object.keys(selectedTokenHolding).length !== 0 &&
      selectedTokenHolding.data.length !== 0 &&
      selectedTokenHolding?.data?.data?.length === 0
    ) {
      filteredHoldingDataToken = [];
      sumTokens = 0;
    }
  }
</script>

<div
  class={`flex flex-col gap-6 rounded-[20px] p-6 ${
    $isDarkMode ? "bg-[#222222]" : "bg-[#fff] border border_0000001a"
  }`}
>
  <ErrorBoundary>
    <div class="flex items-end gap-3">
      <div class="xl:text-2xl text-4xl font-medium">
        {MultipleLang.holding}
      </div>
      <!-- <a
        href="https://forms.gle/HfmvSTzd5frPPYDz8"
        target="_blank"
        class="xl:text-sm text-2xl font-normal text-blue-500 mb-[2px] hover:text-blue-700 transition-all"
      >
        Get investment opportunities notification
      </a> -->
    </div>

    <!-- token holding table -->
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <div class="xl:text-xl text-3xl font-medium">
            {MultipleLang.token}
          </div>
          {#if selectedTokenHolding && Object.keys(selectedTokenHolding).length !== 0 && selectedTokenHolding?.select.length !== 0}
            <Select
              type="lang"
              positionSelectList="left-0"
              listSelect={selectedTokenHolding?.select || []}
              bind:selected={selectedTypeTable}
            />
          {/if}
        </div>
        <div class="xl:text-3xl text-4xl font-medium text-right">
          <TooltipNumber number={sumTokens} type="value" personalValue />
          {#if selectedTokenHolding && Object.keys(selectedTokenHolding).length !== 0 && selectedTokenHolding?.select.length !== 0}
            <span class="xl:text-xl text-2xl font-medium text-gray-400">
              <TooltipNumber
                number={selectedDataPieChart?.series[0]?.data.filter(
                  (item) => item.name === selectedTypeTable?.value
                )[0]?.value}
                type="percent"
              />%
            </span>
          {/if}
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-end gap-2">
          <div class="xl:text-sm text-2xl font-regular text-gray-400">
            Hide tokens less than
          </div>
          <Select
            type="filter"
            positionSelectList="right-0"
            listSelect={filterTokenValueType}
            bind:selected={filterTokenType}
          />
        </div>

        <div
          class={`rounded-[10px] xl:overflow-visible overflow-x-auto h-full ${
            $isDarkMode ? "bg-[#131313]" : "bg-[#fff] border border_0000000d"
          }`}
        >
          <table class="table-auto xl:w-full w-[1800px] h-full">
            <thead
              class={isStickyTableToken ? "sticky top-0 z-10" : ""}
              bind:this={tableTokenHeader}
            >
              <tr class="bg_f4f5f8">
                <th
                  class="pl-3 py-3 rounded-tl-[10px] xl:static xl:bg-transparent sticky left-0 z-10 bg_f4f5f8 w-[420px]"
                >
                  <div
                    class="text-left xl:text-xs text-xl uppercase font-medium"
                  >
                    {MultipleLang.assets}
                  </div>
                </th>
                <th class="py-3">
                  <div
                    class="text-right xl:text-xs text-xl uppercase font-medium"
                  >
                    {MultipleLang.price}
                  </div>
                </th>
                <th class="py-3">
                  <div
                    class="text-right xl:text-xs text-xl uppercase font-medium"
                  >
                    {MultipleLang.amount}
                  </div>
                </th>
                <th class="py-3">
                  <div
                    class="text-right xl:text-xs text-xl uppercase font-medium"
                  >
                    {MultipleLang.value}
                  </div>
                </th>
                <th class="py-3">
                  <div
                    class="text-right xl:text-xs text-xl uppercase font-medium"
                  >
                    Avg Cost
                  </div>
                </th>
                <th class="py-3">
                  <div
                    class="text-right xl:text-xs text-xl uppercase font-medium"
                  >
                    Realized PnL
                  </div>
                </th>
                <th
                  class={`py-3 ${
                    $typeWallet === "SOL" ||
                    $typeWallet === "EVM" ||
                    $typeWallet === "BUNDLE"
                      ? ""
                      : "pr-3 rounded-tr-[10px]"
                  }`}
                >
                  <div
                    class="text-right xl:text-xs text-xl uppercase font-medium"
                  >
                    Unrealized PnL
                  </div>
                </th>
                {#if $typeWallet === "SOL" || $typeWallet === "EVM" || $typeWallet === "BUNDLE"}
                  <th class="py-3 xl:w-12 w-32 rounded-tr-[10px]" />
                {/if}
              </tr>
            </thead>

            {#if $chain === "ALL"}
              <tbody>
                {#if filteredHoldingDataToken && filteredHoldingDataToken.length === 0 && !isLoadingToken}
                  <tr>
                    <td {colspan}>
                      <div
                        class="flex justify-center items-center h-full py-3 px-3 xl:text-lg text-xl text-gray-400"
                      >
                        {#if holdingTokenData && holdingTokenData.length === 0}
                          {MultipleLang.empty}
                        {:else}
                          All tokens less than $1
                        {/if}
                      </div>
                    </td>
                  </tr>
                {/if}
                {#each filteredHoldingDataToken as holding}
                  <HoldingToken
                    data={holding}
                    {selectedWallet}
                    sumAllTokens={totalAssets - sumNFT}
                  />
                {/each}
              </tbody>
              {#if isLoadingToken}
                <tbody>
                  <tr>
                    <td {colspan}>
                      <div
                        class="flex justify-center items-center h-full py-3 px-3"
                      >
                        <Loading />
                      </div>
                    </td>
                  </tr>
                </tbody>
              {/if}
            {/if}

            {#if $chain !== "ALL"}
              {#if isLoadingToken}
                <tbody>
                  <tr>
                    <td {colspan}>
                      <div
                        class="flex justify-center items-center h-full py-3 px-3"
                      >
                        <Loading />
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
                          class="flex justify-center items-center h-full py-3 px-3 xl:text-lg text-xl text-gray-400"
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
                      <HoldingToken
                        data={holding}
                        {selectedWallet}
                        sumAllTokens={totalAssets - sumNFT}
                      />
                    {/each}
                  {/if}
                </tbody>
              {/if}
            {/if}
          </table>
        </div>
      </div>
    </div>

    <!-- nft holding table -->
    {#if $typeWallet !== "CEX"}
      <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <div class="xl:text-xl text-3xl font-medium">
            {MultipleLang.nft}
          </div>
          <div class="xl:text-3xl text-4xl font-medium text-right">
            <TooltipNumber number={sumNFT} type="value" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-end gap-2">
            <div class="xl:text-sm text-2xl font-regular text-gray-400">
              Hide NFT Collections less than
            </div>
            <Select
              type="filter"
              positionSelectList="right-0"
              listSelect={filterTokenValueType}
              bind:selected={filterNFTType}
            />
          </div>

          <div
            class={`rounded-[10px] xl:overflow-visible overflow-x-auto h-full ${
              $isDarkMode ? "bg-[#131313]" : "bg-[#fff] border border_0000000d"
            }`}
          >
            <table class="table-auto xl:w-full w-[1400px] h-full">
              <thead
                class={isStickyTableNFT ? "sticky top-0 z-10" : ""}
                bind:this={tableNFTHeader}
              >
                <tr class="bg_f4f5f8">
                  <th
                    class="pl-3 py-3 rounded-tl-[10px] xl:static xl:bg-transparent sticky left-0 z-10 bg_f4f5f8 w-[220px]"
                  >
                    <div
                      class="text-left xl:text-xs text-xl uppercase font-medium"
                    >
                      {MultipleLang.collection}
                    </div>
                  </th>
                  <th
                    class="py-3 xl:static xl:bg-transparent sticky left-[220px] z-10 bg_f4f5f8 w-[160px]"
                  >
                    <div
                      class="text-left xl:text-xs text-xl uppercase font-medium"
                    >
                      {MultipleLang.Balance}
                    </div>
                  </th>
                  <th class="py-3">
                    <div
                      class="text-right xl:text-xs text-xl uppercase font-medium"
                    >
                      <TooltipTitle
                        tooltipText={false
                          ? "The Floor price from Magic Eden marketplace. "
                          : "The Floor price of last 24h, if there is no volume, the floor price is 0"}
                        link={false ? "https://magiceden.io/ordinals" : ""}
                      >
                        {MultipleLang.floor_price}
                      </TooltipTitle>
                    </div>
                  </th>
                  <th class="py-3">
                    <div
                      class="text-right xl:text-xs text-xl uppercase font-medium"
                    >
                      Cost
                    </div>
                  </th>
                  <th class="py-3">
                    <div
                      class="text-right xl:text-xs text-xl uppercase font-medium"
                    >
                      {MultipleLang.current_value}
                    </div>
                  </th>
                  <th class="py-3 pr-3 rounded-tr-[10px]">
                    <div
                      class="text-right xl:text-xs text-xl uppercase font-medium"
                    >
                      <TooltipTitle
                        tooltipText="Price NFTs now - Price NFTs at time you spent"
                      >
                        {MultipleLang.profit}
                      </TooltipTitle>
                    </div>
                  </th>
                </tr>
              </thead>

              {#if $chain === "ALL"}
                <tbody>
                  {#if filteredHoldingDataNFT && filteredHoldingDataNFT.length === 0 && !isLoadingNFT}
                    <tr>
                      <td colspan={6}>
                        <div
                          class="flex justify-center items-center h-full py-3 px-3 xl:text-lg text-xl text-gray-400"
                        >
                          {#if formatDataNFT && formatDataNFT.length === 0}
                            {MultipleLang.empty}
                          {:else}
                            All NFT Collections less than $1
                          {/if}
                        </div>
                      </td>
                    </tr>
                  {/if}
                  {#each filteredHoldingDataNFT as holding}
                    <HoldingNFT data={holding} {selectedWallet} />
                  {/each}
                </tbody>
                {#if isLoadingNFT}
                  <tbody>
                    <tr>
                      <td colspan={6}>
                        <div
                          class="flex justify-center items-center h-full py-3 px-3"
                        >
                          <Loading />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                {/if}
              {/if}

              {#if $chain !== "ALL"}
                {#if isLoadingNFT}
                  <tbody>
                    <tr>
                      <td colspan={6}>
                        <div
                          class="flex justify-center items-center h-full py-3 px-3"
                        >
                          <Loading />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                {:else}
                  <tbody>
                    {#if filteredHoldingDataNFT && filteredHoldingDataNFT.length === 0}
                      <tr>
                        <td colspan={6}>
                          <div
                            class="flex justify-center items-center h-full py-3 px-3 xl:text-lg text-xl text-gray-400"
                          >
                            {#if formatDataNFT && formatDataNFT.length === 0}
                              {MultipleLang.empty}
                            {:else}
                              All NFT Collections less than $1
                            {/if}
                          </div>
                        </td>
                      </tr>
                    {:else}
                      {#each filteredHoldingDataNFT as holding}
                        <HoldingNFT data={holding} {selectedWallet} />
                      {/each}
                    {/if}
                  </tbody>
                {/if}
              {/if}
            </table>
          </div>
        </div>
      </div>
    {/if}
  </ErrorBoundary>
</div>

<style>
</style>
