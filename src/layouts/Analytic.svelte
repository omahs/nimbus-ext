<script lang="ts">
  import { onMount } from "svelte";
  import mixpanel from "mixpanel-browser";
  import dayjs from "dayjs";
  import isBetween from "dayjs/plugin/isBetween";
  dayjs.extend(isBetween);
  import { nimbus } from "~/lib/network";
  import { wallet, user, isDarkMode, selectedPackage } from "~/store";

  import ErrorBoundary from "~/components/ErrorBoundary.svelte";
  import AppOverlay from "~/components/Overlay.svelte";
  import Analytic from "~/UI/Analytic/Analytic.svelte";
  import Button from "~/components/Button.svelte";
  import Loading from "~/components/Loading.svelte";

  import Crown from "~/assets/crown.svg";

  const currentDate = dayjs();
  const next7Days = currentDate.add(7, "day");

  // let listNft = [];
  // let isLoading = false;

  let isOpenModal = false;
  let isLoadingSendMail = false;
  let email = "";

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

  const onSubmit = async (e) => {
    isLoadingSendMail = true;
    const formData = new FormData(e.target);

    const data: any = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }

    try {
      const res = await nimbus.post(
        "/subscription/analysis",
        {
          email: data.email,
          address: $wallet,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      isLoadingSendMail = false;
    } catch (e) {
      isLoadingSendMail = false;
    } finally {
      localStorage.setItem("isShowFormAnalytic", "true");
      isOpenModal = false;
    }
  };

  onMount(() => {
    mixpanel.track("analytic_page");

    const currentDayStorage = localStorage.getItem("currentDay");
    const next7DaysStorage = localStorage.getItem("next7Days");
    const isSubmitStorage = localStorage.getItem("isShowFormAnalytic");

    if ($selectedPackage === "FREE") {
      if (currentDayStorage && next7DaysStorage) {
        const isTodayBetween = currentDate.isBetween(
          currentDayStorage,
          next7DaysStorage,
          "day",
          "[]"
        );
        if (!isTodayBetween && isSubmitStorage === null) {
          isOpenModal = true;
        } else {
        }
      } else {
        if (isSubmitStorage === null) {
          isOpenModal = true;
        }
      }
    }
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
            <Analytic />
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
  <Analytic />

  <AppOverlay
    clickOutSideToClose
    isOpen={isOpenModal}
    on:close={() => {
      localStorage.setItem("currentDay", currentDate.format("YYYY-MM-DD"));
      localStorage.setItem("next7Days", next7Days.format("YYYY-MM-DD"));
      isOpenModal = false;
    }}
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col">
        <div class="xl:text-base text-2xl text-gray-500 text-center">
          Our analysis is
          <span class="font-medium text-[#ffb800]">Premium</span>
          <img src={Crown} alt="" width="13" height="12" class="inline-block" />
          feature is under beta<br /> which you can access for free now.
        </div>
        <div class="xl:text-base text-2xl text-gray-500">
          Add your email to get updates from us and receive exclusive benefits
          in the future.
        </div>
      </div>
      <form
        on:submit|preventDefault={onSubmit}
        class="flex flex-col xl:gap-3 gap-10"
      >
        <div class="flex flex-col gap-1">
          <div class="flex flex-col gap-1">
            <div
              class={`flex flex-col gap-1 input-2 input-border w-full py-[6px] px-3 ${
                email && !$isDarkMode ? "bg-[#F0F2F7]" : "bg_fafafbff"
              }`}
            >
              <div class="xl:text-base text-2xl text-[#666666] font-medium">
                Email
              </div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your email"
                value=""
                class={`p-0 border-none focus:outline-none focus:ring-0 xl:text-sm text-2xl font-normal text-[#5E656B] placeholder-[#5E656B] ${
                  email && !$isDarkMode ? "bg-[#F0F2F7]" : "bg-transparent"
                }
              `}
                on:keyup={({ target: { value } }) => (email = value)}
              />
            </div>
          </div>
        </div>
        <div class="flex justify-end lg:gap-2 gap-6">
          <div class="lg:w-[120px] w-full">
            <Button
              variant="secondary"
              on:click={() => {
                localStorage.setItem(
                  "currentDay",
                  currentDate.format("YYYY-MM-DD")
                );
                localStorage.setItem(
                  "next7Days",
                  next7Days.format("YYYY-MM-DD")
                );
                isOpenModal = false;
              }}
            >
              Cancel
            </Button>
          </div>
          <div class="lg:w-[120px] w-full">
            <Button
              type="submit"
              isLoading={isLoadingSendMail}
              disabled={isLoadingSendMail}>Submit</Button
            >
          </div>
        </div>
      </form>
    </div>
  </AppOverlay>
</ErrorBoundary>

<style windi:preflights:global windi:safelist:global>
  .input-border {
    border: 1px solid rgb(229, 231, 235);
  }
</style>
