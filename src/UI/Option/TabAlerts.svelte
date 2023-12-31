<script lang="ts">
  import { onMount } from "svelte";
  import { nimbus } from "~/lib/network";
  import { Toast } from "flowbite-svelte";
  import { blur } from "svelte/transition";
  import { wallet, user } from "~/store";

  import Button from "~/components/Button.svelte";

  const percentList = [
    {
      id: "5%",
      value: 5,
      content: "5% Ratio",
    },
    {
      id: "7%",
      value: 7,
      content: "7% Ratio",
    },
    {
      id: "10%",
      value: 10,
      content: "10% Ratio",
    },
  ];

  const summaryList = [
    {
      id: "DAILY",
      value: "DAILY",
      content: "Daily",
    },
    {
      id: "WEEKLY",
      value: "WEEKLY",
      content: "Weekly",
    },
    {
      id: "MONTHLY",
      value: "MONTHLY",
      content: "Monthly",
    },
  ];

  let show = false;
  let counter = 3;
  let toastMsg = "";
  let isSuccess = false;

  let userConfigs = {
    filter_spam_tx_alert: false,
    price_alert: 0,
    summary_setting_alert: "",
    transaction_alert: false,
  };

  let percent = false;
  let summary = false;
  let transaction = false;

  let filterSpamTrx = false;
  let selectedPercent = 0;
  let selectedSummary = "";

  let isLoadingSave = false;

  const trigger = () => {
    show = true;
    counter = 3;
    timeout();
  };

  const timeout = () => {
    if (--counter > 0) return setTimeout(timeout, 1000);
    show = false;
    toastMsg = "";
    isSuccess = false;
  };

  $: {
    if (!transaction) {
      filterSpamTrx = false;
    }
    if (!percent) {
      selectedPercent = 0;
    }
    if (!summary) {
      selectedSummary = "";
    }
  }

  const onSubmitSettingAlert = async () => {
    if (percent && selectedPercent === 0) {
      toastMsg =
        "Please select at least one price percent to receive notification";
      isSuccess = false;
      trigger();
      return;
    }

    if (summary && selectedSummary.length === 0) {
      toastMsg =
        "Please select at least one frequency of portfolio summary to receive notification";
      isSuccess = false;
      trigger();
      return;
    }

    const payload = {
      price: {
        enabled: percent,
        value: selectedPercent !== 0 ? selectedPercent : null,
      },
      portfolioSummary: {
        enabled: summary,
        value: selectedSummary.length !== 0 ? selectedSummary : null,
      },
      transaction: {
        enabled: transaction,
        filterSpam: filterSpamTrx,
      },
    };

    isLoadingSave = true;
    try {
      const res = await nimbus.put("/users/configs/alert-settings", payload);
      if (res && res?.data) {
        selectedPercent = Number(res?.data?.alert_settings?.price?.value);
        selectedSummary = res?.data?.alert_settings?.portfolioSummary?.value;
        transaction = res?.data?.alert_settings?.transaction?.enabled;
        filterSpamTrx = res?.data?.alert_settings?.transaction?.filterSpam;
        if (Number(res?.data?.alert_settings?.price?.value) !== 0) {
          percent = true;
        }
        if (res?.data?.alert_settings?.portfolioSummary?.value !== null) {
          summary = true;
        }

        toastMsg = "Your settings have been successfully saved!";
        isSuccess = true;
      }
    } catch (e) {
      console.error(e);
      toastMsg =
        "There are some problem when save you settings. Please try again!";
      isSuccess = false;
    } finally {
      isLoadingSave = false;
      trigger();
    }
  };

  const cancelSaveSetting = () => {
    selectedPercent = Number(userConfigs.price_alert);
    selectedSummary = userConfigs.summary_setting_alert;
    transaction = userConfigs.transaction_alert;
    filterSpamTrx = userConfigs.filter_spam_tx_alert;
    if (userConfigs.price_alert !== 0) {
      percent = true;
    }
    if (userConfigs.summary_setting_alert !== null) {
      summary = true;
    }
  };

  const getUserConfigs = async () => {
    try {
      const res: any = await nimbus.get("/users/configs");
      userConfigs = {
        filter_spam_tx_alert:
          res?.data?.alert_settings?.transaction?.filterSpam,
        price_alert: Number(res?.data?.alert_settings?.price?.value),
        summary_setting_alert:
          res?.data?.alert_settings?.portfolioSummary?.value,
        transaction_alert: res?.data?.alert_settings?.transaction?.enabled,
      };

      if (res && res?.data) {
        selectedPercent = Number(res?.data?.alert_settings?.price?.value);
        selectedSummary = res?.data?.alert_settings?.portfolioSummary?.value;
        transaction = res?.data?.alert_settings?.transaction?.enabled;
        filterSpamTrx = res?.data?.alert_settings?.transaction?.filterSpam;
        if (Number(res?.data?.alert_settings?.price?.value) !== 0) {
          percent = true;
        }
        if (res?.data?.alert_settings?.portfolioSummary?.value !== null) {
          summary = true;
        }

        toastMsg = "Your settings have been successfully saved!";
        isSuccess = true;
      }
    } catch (e) {
      console.error(e);
    }
  };

  onMount(() => {
    getUserConfigs();
  });
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-col gap-1 border-b-[1.5px] border_0000000d pb-4">
    <div class="xl:title-3 title-1">Alert Settings</div>
    <div class="xl:text-base text-xl text-gray-500">
      Management your setup alerts
    </div>
  </div>
  <form
    on:submit|preventDefault={onSubmitSettingAlert}
    class="flex flex-col gap-8 pt-4"
  >
    <div class="flex flex-col gap-3">
      <div class="flex justify-between items-center gap-6">
        <div class="flex flex-col">
          <div class="xl:text-base text-2xl">Price change notification</div>
          <div class="xl:text-sm text-xl text-gray-400">
            Receive notification whenever your price percent change
          </div>
        </div>
        <label class="switch">
          <input
            type="checkbox"
            checked={percent}
            on:click={() => {
              percent = !percent;
            }}
          />
          <span class="slider" />
        </label>
      </div>
      <div class="flex flex-col gap-3">
        {#each percentList as item}
          <label class="flex items-center xl:gap-2 gap-6 cursor-pointer w-max">
            <input
              type="radio"
              disabled={!percent}
              name={item.id}
              id={item.id}
              value={item.value}
              bind:group={selectedPercent}
              class={`cursor-pointer relative xl:w-4 xl:h-4 w-6 h-6 appearance-none rounded-full border outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] ${
                percent ? "" : "bg-gray-200 border-gray-200"
              }`}
            />
            <div class="xl:text-sm text-2xl font-normal cursor-pointer">
              {item.content}
            </div>
          </label>
        {/each}
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center gap-6">
        <div class="flex flex-col">
          <div class="xl:text-base text-2xl">
            Frequency of portfolio summary notification
          </div>
          <div class="xl:text-sm text-xl text-gray-400">
            Receive portfolio summary every daily, weekly or monthly
          </div>
        </div>
        <label class="switch">
          <input
            type="checkbox"
            checked={summary}
            on:click={() => {
              summary = !summary;
            }}
          />
          <span class="slider" />
        </label>
      </div>
      <div class="flex flex-col gap-3">
        {#each summaryList as item}
          <div class="flex items-center xl:gap-2 gap-6 cursor-pointer w-max">
            <input
              type="radio"
              disabled={!summary}
              name={item.id}
              id={item.id}
              value={item.value}
              class={`cursor-pointer relative xl:w-4 xl:h-4 w-6 h-6 appearance-none rounded-full border outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] ${
                summary ? "" : "bg-gray-200 border-gray-200"
              }`}
              bind:group={selectedSummary}
            />
            <label
              for={item.id}
              class="xl:text-sm text-2xl font-normal cursor-pointer"
            >
              {item.content}
            </label>
          </div>
        {/each}
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center gap-6">
        <div class="flex flex-col">
          <div class="xl:text-base text-2xl">Transaction notification</div>
          <div class="xl:text-sm text-xl text-gray-400">
            Receive notification whenever you have transaction
          </div>
        </div>
        <label class="switch">
          <input
            type="checkbox"
            checked={transaction}
            on:click={() => {
              transaction = !transaction;
            }}
          />
          <span class="slider" />
        </label>
      </div>
      <div class="flex items-center gap-2">
        <div class="xl:text-sm text-2xl font-normal">
          Filter spam transaction
        </div>
        <label class="switch">
          <input
            type="checkbox"
            disabled={!transaction}
            checked={filterSpamTrx}
            on:click={() => {
              filterSpamTrx = !filterSpamTrx;
            }}
          />
          <span class="slider" />
        </label>
      </div>
    </div>

    <div class="flex justify-start gap-6 lg:gap-2 mt-6">
      <div class="w-[120px]">
        <Button variant="secondary" on:click={cancelSaveSetting}>Cancel</Button>
      </div>
      <div class="w-[120px]">
        <Button type="submit" variant="tertiary" isLoading={isLoadingSave}>
          Save
        </Button>
      </div>
    </div>
  </form>
</div>

{#if show}
  <div class="fixed z-10 w-full top-3 right-3">
    <Toast
      transition={blur}
      params={{ amount: 10 }}
      position="top-right"
      color={isSuccess ? "green" : "red"}
      bind:open={show}
    >
      <svelte:fragment slot="icon">
        {#if isSuccess}
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            /></svg
          >
          <span class="sr-only">Check icon</span>
        {:else}
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            /></svg
          >
          <span class="sr-only">Error icon</span>
        {/if}
      </svelte:fragment>
      {toastMsg}
    </Toast>
  </div>
{/if}

<style>
  :global(body) .bg_fafafbff {
    background: #fafafbff;
  }
  :global(body.dark) .bg_fafafbff {
    background: #212121;
  }

  :global(body) .bg_f4f5f8 {
    background: #f4f5f8;
  }
  :global(body.dark) .bg_f4f5f8 {
    background: #131313;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
  }
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
  input:checked + .slider {
    background-color: #2196f3;
  }
  input:checked + .slider {
    box-shadow: 0 0 1px #2196f3;
  }
  input:checked + .slider:before {
    -webkit-transform: translateX(16px);
    -ms-transform: translateX(16px);
    transform: translateX(16px);
  }
</style>
