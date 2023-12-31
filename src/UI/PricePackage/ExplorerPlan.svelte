<script lang="ts">
  import { getTooltipContent } from "~/utils";
  import { isDarkMode } from "~/store";

  export let selectedTypePackage;

  import tooltip from "~/entries/contentScript/views/tooltip";

  import YieldFarmingVideo from "~/assets/pricing/Yield-Farming.mp4";
  import RiskVideo from "~/assets/pricing/Risk.mp4";
  import ReturnVideo from "~/assets/pricing/Return.mp4";
  import RiskReturnVideo from "~/assets/pricing/Risk-Return.mp4";
  import RealtimeVideo from "~/assets/pricing/Realtime.mp4";
  import RebalanceVideo from "~/assets/pricing/Rebalance.mp4";
  import CustomAllocationVideo from "~/assets/pricing/Custom-Allocation.mp4";
</script>

<div class="flex items-end gap-2 font-semibold text-4xl xl:text-3xl">
  <span>{selectedTypePackage === "month" ? "$9.99" : "$8.25"}</span><span
    class="text-2xl xl:text-xl text-gray-400 mb-[2px]">/month</span
  >
</div>
<div>
  <div class="flex flex-col border-b-[1px] border_0000001a pb-4">
    <div class="font-medium text-3xl xl:text-xl">EXPLORER</div>
    <div class="text-gray-500 text-2xl xl:text-lg">
      Boost your return and reduce your risk
    </div>
  </div>
  <div class="flex flex-col items-start gap-2 mt-4">
    <div
      class="underline cursor-pointer text-xl xl:text-base decoration-dotted"
      use:tooltip={{
        content: getTooltipContent(
          "Get latest market information and real-time market update",
          RealtimeVideo,
          false,
          $isDarkMode
        ),
        allowHTML: true,
        placement: "top",
        interactive: true,
      }}
    >
      Real-time market update
    </div>
    <div class="text-xl xl:text-base">
      <span class="font-bold">7</span> tracked Wallets
    </div>
    <div class="text-xl xl:text-base">
      <span class="font-bold">$50 000</span> total net worth
    </div>
    <div
      use:tooltip={{
        content: getTooltipContent(
          "Get up to 1000+ yield farming opportunities to boost your earning",
          YieldFarmingVideo,
          false,
          $isDarkMode
        ),
        allowHTML: true,
        placement: "top",
        interactive: true,
      }}
      class="underline cursor-pointer text-xl xl:text-base decoration-dotted"
    >
      Yield farming opportunities
    </div>
    <div class="text-xl xl:text-base">Whales screeners</div>
    <div
      use:tooltip={{
        content: getTooltipContent(
          "Custom your token category to diversify your portfolio on your own way",
          CustomAllocationVideo,
          false,
          $isDarkMode
        ),
        allowHTML: true,
        placement: "top",
        interactive: true,
      }}
      class="underline cursor-pointer text-xl xl:text-base decoration-dotted"
    >
      Custom token category
    </div>
    <div
      use:tooltip={{
        content: getTooltipContent(
          "Know what is your portfolio risk, in every single token you hold",
          RiskVideo,
          false,
          $isDarkMode
        ),
        allowHTML: true,
        placement: "top",
        interactive: true,
      }}
      class="underline cursor-pointer text-xl xl:text-base decoration-dotted"
    >
      Risks analysis
    </div>
    <div
      class="underline cursor-pointer text-xl xl:text-base decoration-dotted"
      use:tooltip={{
        content: getTooltipContent("", ReturnVideo, false, $isDarkMode),
        allowHTML: true,
        placement: "top",
        interactive: true,
      }}
    >
      Returns analysis
    </div>
    <div
      class="underline cursor-pointer text-xl xl:text-base decoration-dotted"
      use:tooltip={{
        content: getTooltipContent("", RiskReturnVideo, false, $isDarkMode),
        allowHTML: true,
        placement: "top",
        interactive: true,
      }}
    >
      Risks & Returns analysis
    </div>
    <div
      class="underline cursor-pointer text-xl xl:text-base decoration-dotted"
      use:tooltip={{
        content: getTooltipContent(
          "We suggest you how to optimize your portfolio to minimize the risk while maximizing the return",
          RebalanceVideo,
          false,
          $isDarkMode
        ),
        allowHTML: true,
        placement: "top",
        interactive: true,
      }}
    >
      Rebalance Strategy
    </div>
    <div class="text-xl xl:text-base">Token Correlations matrix (Soon)</div>
    <div class="text-xl xl:text-base text-gray-400">Professional community</div>
    <slot name="button" />
  </div>
</div>

<style windi:preflights:global windi:safelist:global></style>
