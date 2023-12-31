<svelte:options tag="tab-notification" />

<script lang="ts">
  import { i18n } from "~/lib/i18n";
  import { nimbus } from "~/lib/network";
  import CopyToClipboard from "svelte-copy-to-clipboard";
  import { createQuery } from "@tanstack/svelte-query";
  import { isDarkMode, user } from "~/store";

  import Loading from "~/components/Loading.svelte";
  import Copy from "~/components/Copy.svelte";
  import AppOverlay from "~/components/Overlay.svelte";
  import Button from "~/components/Button.svelte";

  import FollowWhale from "~/assets/whale-tracking.gif";

  const MultipleLang = {
    title: i18n("optionsPage.notification-page-title", "Notification"),
    content: {
      address_header_table: i18n(
        "optionsPage.accounts-page-content.address-header-table",
        "Wallet"
      ),
      label_header_table: i18n(
        "optionsPage.accounts-page-content.label-header-table",
        "Label"
      ),
      action_header_table: i18n(
        "optionsPage.accounts-page-content.action-header-table",
        "Action"
      ),
    },
  };

  let listAddress = [];
  let isOpenFollowWhaleModal = false;
  let showCommandTooltip = false;
  let selectedWallet;

  const formatDataListAddress = (data) => {
    const structWalletData = data.map((item) => {
      return {
        position: item.position,
        id: item.id,
        type: item.type,
        label: item.label,
        address: item.type === "CEX" ? item.id : item.accountId,
      };
    });
    listAddress = structWalletData;
  };

  const getListAddress = async () => {
    const response: any = await nimbus.get("/accounts/list");
    return response?.data;
  };

  $: query = createQuery({
    queryKey: ["list-address"],
    queryFn: () => getListAddress(),
    staleTime: Infinity,
    retry: false,
    enabled: $user && Object.keys($user).length !== 0,
    onError(err) {
      localStorage.removeItem("evm_token");
      user.update((n) => (n = {}));
    },
  });

  $: {
    if (!$query.isError && $query.data !== undefined) {
      formatDataListAddress($query.data);
    }
  }
</script>

<div class="flex flex-col gap-2">
  <div class="xl:title-3 title-1 mb-2">{MultipleLang.title}</div>

  <div class={`${$query.isFetching ? "h-[400px]" : ""}`}>
    <div
      class={`border border_0000000d rounded-[10px] xl:overflow-hidden overflow-x-auto ${
        $isDarkMode ? "bg-[#131313]" : "bg-[#fff]"
      }`}
    >
      <table class="table-auto xl:w-full w-[1200px] h-full">
        <thead>
          <tr class="bg_f4f5f8">
            <th class="pl-3 py-3">
              <div
                class="text-left xl:text-sm text-2xl uppercase font-semibold"
              >
                {MultipleLang.content.address_header_table}
              </div>
            </th>
            <th class="py-3">
              <div
                class="text-left xl:text-sm text-2xl uppercase font-semibold"
              >
                {MultipleLang.content.label_header_table}
              </div>
            </th>
            <th class="pr-3 py-3">
              <div
                class="text-right xl:text-sm text-2xl uppercase font-semibold"
              >
                {MultipleLang.content.action_header_table}
              </div>
            </th>
          </tr>
        </thead>
        {#if $query.isFetching}
          <tbody>
            <tr>
              <td colspan="3">
                <div class="flex justify-center items-center h-full py-4 px-3">
                  <Loading />
                </div>
              </td>
            </tr>
          </tbody>
        {:else}
          <tbody>
            {#if listAddress && listAddress.length === 0}
              <tr>
                <td colspan="3">
                  <div
                    class="flex justify-center items-center h-full py-4 px-3 xl:text-base text-2xl"
                  >
                    No address
                  </div>
                </td>
              </tr>
            {:else}
              {#each listAddress as item (item.id)}
                <tr class="group transition-all">
                  <td
                    class={`pl-3 py-3  ${
                      $isDarkMode
                        ? "group-hover:bg-[#000]"
                        : "group-hover:bg-gray-100"
                    }`}
                  >
                    <div class="text-left xl:text-base text-2xl">
                      <Copy
                        address={item.address}
                        iconColor={`${$isDarkMode ? "#fff" : "#000"}`}
                        color={`${$isDarkMode ? "#fff" : "#000"}`}
                      />
                    </div>
                  </td>

                  <td
                    class={`py-3  ${
                      $isDarkMode
                        ? "group-hover:bg-[#000]"
                        : "group-hover:bg-gray-100"
                    }`}
                  >
                    <div
                      class="bg-[#6AC7F533] text_27326F w-max px-3 py-1 rounded-[5px] xl:text-base text-2xl"
                    >
                      {item.label}
                    </div>
                  </td>

                  <td
                    class={`py-3 pr-3 ${
                      $isDarkMode
                        ? "group-hover:bg-[#000]"
                        : "group-hover:bg-gray-100"
                    }`}
                  >
                    <div class="flex justify-end gap-6">
                      <div
                        class="text-blue-600 hover:underline xl:text-base text-2xl transition-all cursor-pointer font-semibold"
                        on:click={() => {
                          selectedWallet = item.address;
                          isOpenFollowWhaleModal = true;
                        }}
                      >
                        Get command
                      </div>
                    </div>
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        {/if}
      </table>
    </div>
  </div>
</div>

<AppOverlay
  clickOutSideToClose
  isOpen={isOpenFollowWhaleModal}
  on:close={() => (isOpenFollowWhaleModal = false)}
>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <div class="xl:text-base text-2xl">
        Go to <a
          href="https://t.me/GetNimbusBot"
          target="_blank"
          class="text-blue-500">https://t.me/GetNimbusBot</a
        >
      </div>
      <div class="xl:text-base text-2xl">Use the command as follow video</div>
    </div>
    <div class="xl:h-[350px] h-[650px]">
      <img src={FollowWhale} alt="" class="w-full h-full object-contain" />
    </div>
    <div class="w-full flex justify-end">
      <CopyToClipboard
        text={`/portfolio ${selectedWallet} ${
          listAddress.filter((item) => item.address === selectedWallet)[0].label
        }`}
        let:copy
      >
        <div
          class="w-max relative"
          on:mouseenter={() => {
            showCommandTooltip = true;
          }}
          on:mouseleave={() => {
            showCommandTooltip = false;
          }}
        >
          <Button
            on:click={() => {
              copy();
              isOpenFollowWhaleModal = false;
              showCommandTooltip = false;
            }}>Copy command</Button
          >
          {#if showCommandTooltip}
            <div
              class="absolute -top-8 left-1/2 transform -translate-x-1/2"
              style="z-index: 2147483648;"
            >
              <tooltip-detail
                text={`/portfolio ${selectedWallet} ${
                  listAddress.filter(
                    (item) => item.address === selectedWallet
                  )[0].label
                }`}
              />
            </div>
          {/if}
        </div>
      </CopyToClipboard>
    </div>
  </div>
</AppOverlay>

<style>
  :global(body) .bg_f4f5f8 {
    background: #f4f5f8;
  }
  :global(body.dark) .bg_f4f5f8 {
    background: #131313;
  }
</style>
