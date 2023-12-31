<script lang="ts">
  import { isDarkMode } from "~/store";

  import EChart from "~/components/EChart.svelte";
  import TooltipTitle from "./TooltipTitle.svelte";
  import TooltipNumber from "./TooltipNumber.svelte";

  export let option;
  export let isLoadingChart;
  export let isEmptyDataChart;
  export let isTrxPage = false;
  export let title;
  export let tooltipTitle;
  export let sum = 0;
  export let id;
  export let type;

  import LoadingPremium from "./LoadingPremium.svelte";
  import Loading from "./Loading.svelte";

  import Logo from "~/assets/logo-1.svg";
  import LogoWhite from "~/assets/logo-white.svg";

  $: theme = $isDarkMode ? "dark" : "white";
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-col gap-1 pl-6">
    <div
      class={`font-medium flex justify-start z-10 w-max ${
        isTrxPage ? "xl:text-2xl text-4xl" : "xl:text-xl text-3xl"
      }`}
    >
      {#if tooltipTitle}
        <TooltipTitle tooltipText={tooltipTitle} isBigIcon>
          {title}
        </TooltipTitle>
      {:else}
        {title}
      {/if}
    </div>
    {#if sum !== 0}
      <div class="xl:text-lg text-2xl font-medium flex">
        $<TooltipNumber number={sum} type="balance" />
      </div>
    {/if}
  </div>

  {#if isTrxPage}
    <div class="h-full">
      {#if isEmptyDataChart}
        <div
          class="flex justify-center items-center h-full xl:text-lg text-xl text-gray-400 h-[152px]"
        >
          Empty
        </div>
      {:else}
        <div class="relative xl:-mt-12">
          <EChart
            {id}
            {theme}
            option={{
              ...option,
              calendar: {
                ...option.calendar,
                itemStyle: {
                  ...option.calendar.itemStyle,
                  color: "transparent",
                },
              },
            }}
            notMerge={true}
          />

          <div
            class="absolute transform -translate-x-1/2 -translate-y-1/2 opacity-50 top-2/3 left-1/2 pointer-events-none"
          >
            <img
              src={$isDarkMode ? LogoWhite : Logo}
              alt=""
              width="140"
              height="140"
            />
          </div>
        </div>
      {/if}
    </div>
  {:else if isLoadingChart}
    <div class="flex items-center justify-center h-[152px]">
      {#if type === "primary"}
        <LoadingPremium />
      {:else}
        <Loading />
      {/if}
    </div>
  {:else}
    <div class="h-full">
      {#if isEmptyDataChart}
        <div
          class="flex justify-center items-center h-full xl:text-lg text-xl text-gray-400 h-[152px]"
        >
          Empty
        </div>
      {:else}
        <div class="relative xl:-mt-12">
          <EChart
            {id}
            {theme}
            option={{
              ...option,
              calendar: {
                ...option.calendar,
                itemStyle: {
                  ...option.calendar.itemStyle,
                  color: "transparent",
                },
              },
            }}
            notMerge={true}
          />

          <div
            class="absolute transform -translate-x-1/2 -translate-y-1/2 opacity-50 top-2/3 left-1/2 pointer-events-none"
          >
            <img
              src={$isDarkMode ? LogoWhite : Logo}
              alt=""
              width="140"
              height="140"
            />
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style></style>
