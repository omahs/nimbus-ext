<script lang="ts">
  import { useNavigate } from "svelte-navigator";
  import { isDarkMode } from "~/store";

  import "~/components/Tooltip.custom.svelte";
  import TooltipNumber from "~/components/TooltipNumber.svelte";
  import tooltip from "~/entries/contentScript/views/tooltip";

  import TrendUp from "~/assets/trend-up.svg";
  import TrendDown from "~/assets/trend-down.svg";
  import Chart from "~/assets/chart.svg";

  export let data;

  const navigate = useNavigate();

  $: balance0 = Number(data.amount0out) * data.market_price0;
  $: balance1 = Number(data.amount1out) * data.market_price1;
  $: claim0 = data.claimable0Amount * data.market_price0;
  $: claim1 = data.claimable1Amount * data.market_price1;

  $: value = balance0 + balance1 + claim0 + claim1;

  $: profit = data.inputValue + value;
  $: profitPercent =
    Math.abs(data.inputValue || 0) === 0
      ? 0
      : profit / Math.abs(data.inputValue);
</script>

<tr
  class="group transition-all cursor-pointer"
  on:click={() => {
    navigate(`/test-detail`);
  }}
>
  <td
    class={`pl-3 py-4 xl:static xl:bg-transparent sticky left-0 z-9 ${
      $isDarkMode
        ? "bg-[#110c2a] group-hover:bg-[#000]"
        : "bg-white group-hover:bg-gray-100"
    }`}
  >
    <div class="text-left flex flex-col items-start gap-2">
      <div class="flex space-x-3">
        {#each data.tokens as token, index}
          <img
            src={token.logo}
            alt="token"
            width="30"
            height="30"
            class="rounded-full"
          />
        {/each}
      </div>
      <div class="flex flex-col gap-1">
        <div class="xl:text-sm text-2xl font-medium">
          {data.name}
        </div>
        {#if data.tokens && data.tokens.length}
          <div class="flex items-center gap-1">
            {#each data.tokens as token, index}
              <div class="text_00000080 xl:text-xs text-sm font-medium">
                {token.symbol}
              </div>
              {#if index < data.tokens.length - 1}
                <div class="text_00000080 xl:text-xs text-sm font-medium">
                  -
                </div>
              {/if}
            {/each}
          </div>
        {:else}
          <div>None</div>
        {/if}
      </div>
    </div>
  </td>

  <td
    class={`py-3 w-[150px] ${
      $isDarkMode ? "group-hover:bg-[#000]" : "group-hover:bg-gray-100"
    }`}
  >
    <div class="text-left xl:text-sm text-2xl text_00000099 font-medium">
      {data.isActive ? "In range" : "No"}
    </div>
  </td>

  <td
    class={`py-3  ${
      $isDarkMode ? "group-hover:bg-[#000]" : "group-hover:bg-gray-100"
    }`}
  >
    <div
      class="xl:text-sm text-2xl text_00000099 font-medium flex flex-col items-end"
    >
      <div class="flex flex-col items-end">
        <div class="flex items-center gap-1">
          <div class="flex items-center gap-1">
            <TooltipNumber number={Number(data.amount0out)} type="balance" />
            {data.amount0Price?.symbol ? data.amount0Price?.symbol : ""} |
          </div>
          <div class="flex">
            $<TooltipNumber number={balance0} type="balance" />
          </div>
        </div>
        <div class="flex items-center gap-1">
          <div class="flex items-center gap-1">
            <TooltipNumber number={Number(data.amount1out)} type="balance" />
            {data.amount1Price?.symbol ? data.amount1Price?.symbol : ""} |
          </div>
          <div class="flex">
            $<TooltipNumber number={balance1} type="balance" />
          </div>
        </div>
      </div>
      <div class=" flex items-center gap-1">
        Total: <div class="flex">
          $<TooltipNumber number={balance0 + balance1} type="balance" />
        </div>
      </div>
    </div>
  </td>

  <td
    class={`py-3  ${
      $isDarkMode ? "group-hover:bg-[#000]" : "group-hover:bg-gray-100"
    }`}
  >
    <div
      class="xl:text-sm text-2xl text_00000099 font-medium flex flex-col items-end"
    >
      <div class="flex flex-col items-end">
        <div class="flex items-center gap-1">
          <div class="flex items-center gap-1">
            <TooltipNumber
              number={Number(data.claimable0Amount)}
              type="balance"
            />
            {data.amount0Price?.symbol ? data.amount0Price?.symbol : ""} |
          </div>
          <div class="flex">
            $<TooltipNumber number={claim0} type="balance" />
          </div>
        </div>
        <div class="flex items-center gap-1">
          <div class="flex items-center gap-1">
            <TooltipNumber
              number={Number(data.claimable1Amount)}
              type="balance"
            />
            {data.amount1Price?.symbol ? data.amount1Price?.symbol : ""} |
          </div>
          <div class="flex">
            $<TooltipNumber number={claim1} type="balance" />
          </div>
        </div>
      </div>
      <div class=" flex items-center gap-1">
        Total:
        <div class="flex">
          $<TooltipNumber number={claim0 + claim1} type="balance" />
        </div>
      </div>
    </div>
  </td>

  <td
    class={`py-3  ${
      $isDarkMode ? "group-hover:bg-[#000]" : "group-hover:bg-gray-100"
    }`}
  >
    <div
      class="flex justify-end xl:text-sm text-2xl text-[#000000] font-medium"
    >
      $<TooltipNumber number={value} type="balance" />
    </div>
  </td>

  <td
    class={`py-3  ${
      $isDarkMode ? "group-hover:bg-[#000]" : "group-hover:bg-gray-100"
    }`}
  >
    <div class="xl:text-sm text-2xl font-medium flex flex-col">
      <div
        class={`flex justify-end ${
          data?.ipLoss?.loss >= 0 ? "text-red-500" : "text-[#00A878]"
        }`}
      >
        $<TooltipNumber number={Math.abs(data?.ipLoss?.loss)} type="balance" />
      </div>
      <div class="flex items-center justify-end gap-1">
        <div
          class={`flex items-center ${
            data?.ipLoss?.loss >= 0 ? "text-red-500" : "text-[#00A878]"
          } text-right`}
        >
          <TooltipNumber
            number={Math.abs(data?.ipLoss?.lossPercent)}
            type="percent"
          />
          <span>%</span>
        </div>
        <img
          src={data?.ipLoss?.loss >= 0 ? TrendDown : TrendUp}
          alt="trend"
          class="mb-1"
        />
      </div>
    </div>
  </td>

  <td
    class={`py-3  ${
      $isDarkMode ? "group-hover:bg-[#000]" : "group-hover:bg-gray-100"
    }`}
  >
    <div class="xl:text-sm text-2xl font-medium flex flex-col">
      <div
        class={`flex justify-end ${
          profit >= 0 ? "text-[#00A878]" : "text-red-500"
        }`}
      >
        $<TooltipNumber number={Math.abs(profit)} type="balance" />
      </div>
      {#if value > 0}
        <div class="flex items-center justify-end gap-1">
          <div
            class={`flex items-center ${
              profit >= 0 ? "text-[#00A878]" : "text-red-500"
            } text-right`}
          >
            <TooltipNumber
              number={Math.abs(profitPercent) * 100}
              type="percent"
            />
            <span>%</span>
          </div>
          <img
            src={profit >= 0 ? TrendUp : TrendDown}
            alt="trend"
            class="mb-1"
          />
        </div>
      {/if}
    </div>
  </td>

  <td
    class={`py-3 w-10 ${
      $isDarkMode ? "group-hover:bg-[#000]" : "group-hover:bg-gray-100"
    }`}
  >
    <div class="flex justify-center">
      <div
        use:tooltip={{
          content: `<tooltip-detail text="Show detail" />`,
          allowHTML: true,
          placement: "top",
        }}
      >
        <img src={Chart} alt="" width={14} height={14} />
      </div>
    </div>
  </td>
</tr>

<style>
</style>
