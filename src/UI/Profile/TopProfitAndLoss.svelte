<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import dayjs from "dayjs";
  import { nimbus } from "~/lib/network";
  import { user } from "~/store";
  import { shorterName, handleImgError } from "~/utils";

  import Loading from "~/components/Loading.svelte";
  import TooltipNumber from "~/components/TooltipNumber.svelte";

  export let selectedAddress;

  let closedHoldingPosition = [];
  let top5ProfitToken = [];
  let top5LossToken = [];

  const getTradingStats = async (address) => {
    const response: any = await nimbus.get(
      `/v2/analysis/${address}/trading-stats`
    );
    return response?.data;
  };

  const formatDataTradingStats = (dataTokenHolding) => {
    const formatData = dataTokenHolding.metadata
      .filter(
        (item) => dayjs().subtract(30, "day").valueOf() < item.lastTrade * 1000
      )
      .map((item) => {
        return {
          ...item.holding,
          value:
            Number(item?.holding?.amount) *
            Number(item?.holding?.price?.price || item?.holding?.rate),
        };
      })
      .sort((a, b) => {
        if (a.value < b.value) {
          return 1;
        }
        if (a.value > b.value) {
          return -1;
        }
        return 0;
      });

    let listProfitToken = [];
    let listLossToken = [];

    closedHoldingPosition = formatData
      .filter((item) => item?.profit?.realizedProfit)
      .map((item) => {
        return {
          ...item,
          realizedProfit: item?.profit?.realizedProfit,
          percentRealizedProfit:
            (item?.avgCost || 0) === 0
              ? 0
              : (Number(item?.profit?.realizedProfit) /
                  Number(Math.abs(item?.avgCost))) *
                100,
        };
      });

    closedHoldingPosition.map((item) => {
      if (item.realizedProfit < 0) {
        listLossToken.push(item);
      } else {
        listProfitToken.push(item);
      }
    });

    top5ProfitToken = listProfitToken
      .sort((a, b) => b.realizedProfit - a.realizedProfit)
      .slice(0, 5);

    top5LossToken = listLossToken
      .sort((a, b) => a.realizedProfit - b.realizedProfit)
      .slice(0, 5);
  };

  $: queryTradingStats = createQuery({
    queryKey: ["trading-stats", selectedAddress],
    queryFn: () => getTradingStats(selectedAddress),
    staleTime: Infinity,
    retry: false,
    enabled: selectedAddress?.length !== 0 && Object.keys($user).length !== 0,
  });

  $: {
    if (
      !$queryTradingStats.isError &&
      $queryTradingStats.data &&
      $queryTradingStats.data !== undefined
    ) {
      formatDataTradingStats($queryTradingStats.data);
    }
  }
</script>

<div class="col-span-4 grid grid-cols-2 gap-5">
  <div class="flex flex-col gap-5 border border_0000001a rounded-xl px-6 py-6">
    <div class="xl:text-xl text-3xl font-medium">Top 5 Profit (30D)</div>

    <div class="min-h-[280px]">
      {#if $queryTradingStats.isFetching}
        <div class="h-full flex justify-center items-center">
          <Loading />
        </div>
      {:else}
        <div class="h-full flex flex-col gap-4">
          {#if top5ProfitToken.length === 0}
            <div class="h-full flex items-center justify-center text-center">
              There is no closed holding position in the last 30 day
            </div>
          {:else}
            {#each top5ProfitToken as item}
              <div class="flex items-center justify-between gap-2">
                <div class="flex-1 flex items-center gap-2">
                  <img
                    src={item.logo}
                    alt=""
                    width="30"
                    height="30"
                    on:error={(e) =>
                      handleImgError(
                        e,
                        item?.logo,
                        "https://raw.githubusercontent.com/getnimbus/assets/main/token.png"
                      )}
                    class="rounded-full"
                  />
                  <span class="flex flex-col">
                    <span class="text-lg xl:text-base font-medium">
                      {item.name}
                    </span>
                    <span class="text-lg font-medium text_00000080 xl:text-xs">
                      {#if item.symbol === undefined}
                        N/A
                      {:else}
                        {shorterName(item.symbol, 20)}
                      {/if}
                    </span>
                  </span>
                </div>
                <div class="text-[#00A878] xl:text-base text-lg">
                  <TooltipNumber number={item.realizedProfit} type="value" />
                </div>
              </div>
            {/each}
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <div class="flex flex-col gap-5 border border_0000001a rounded-xl px-6 py-6">
    <div class="xl:text-xl text-3xl font-medium">Top 5 Loss (30D)</div>

    <div class="min-h-[280px]">
      {#if $queryTradingStats.isLoading}
        <div class="h-full flex justify-center items-center">
          <Loading />
        </div>
      {:else}
        <div class="h-full flex flex-col gap-4">
          {#if top5LossToken.length === 0}
            <div class="h-full flex items-center justify-center text-center">
              There is no closed holding position in the last 30 day
            </div>
          {:else}
            {#each top5LossToken as item}
              <div class="h-full flex items-center justify-between gap-2">
                <div class="flex-1 flex items-center gap-2">
                  <img
                    src={item.logo}
                    alt=""
                    width="30"
                    height="30"
                    on:error={(e) =>
                      handleImgError(
                        e,
                        item?.logo,
                        "https://raw.githubusercontent.com/getnimbus/assets/main/token.png"
                      )}
                    class="rounded-full"
                  />
                  <span class="flex flex-col">
                    <span class="text-lg xl:text-base font-medium">
                      {item.name}
                    </span>
                    <span class="text-lg font-medium text_00000080 xl:text-xs">
                      {#if item.symbol === undefined}
                        N/A
                      {:else}
                        {shorterName(item.symbol, 20)}
                      {/if}
                    </span>
                  </span>
                </div>
                <div class="text-red-500 xl:text-base text-lg">
                  <TooltipNumber number={item.realizedProfit} type="value" />
                </div>
              </div>
            {/each}
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<style windi:preflights:global windi:safelist:global></style>
