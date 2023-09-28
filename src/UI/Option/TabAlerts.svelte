<script lang="ts">
  let percent = false;
  let summary = false;
  let transaction = false;

  let filterSpamTrx = false;

  const percentList = [
    {
      id: "5%",
      value: 5,
      content: "5%",
    },
    {
      id: "7%",
      value: 7,
      content: "7%",
    },
    {
      id: "10%",
      value: 10,
      content: "10%",
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

  let selectedPercent = [];
  let selectedSummary = [];

  $: {
    if (!transaction) {
      filterSpamTrx = false;
    }
    if (!percent) {
      selectedPercent = [];
    }
    if (!summary) {
      selectedSummary = [];
    }
  }
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-col gap-1 border-b-[1.5px] border_0000000d pb-4">
    <div class="xl:title-3 title-1">Alert Settings</div>
    <div class="xl:text-base text-xl text-gray-500">
      Management your setup alerts
    </div>
  </div>
  <div class="flex flex-col gap-8 pt-4">
    <div class="flex flex-col gap-3">
      <div class="flex justify-between items-center gap-6">
        <div class="flex flex-col">
          <div class="xl:text-base text-xl">Price percent notification</div>
          <div class="xl:text-sm text-base text-gray-400">
            Receive notification whenever your price percent change
          </div>
        </div>
        <label class="switch">
          <input type="checkbox" bind:checked={percent} />
          <span class="slider" />
        </label>
      </div>
      <div class="flex flex-col gap-3">
        {#each percentList as item}
          <div class="flex items-center gap-2 cursor-pointer w-max">
            <input
              type="checkbox"
              disabled={!percent}
              name={item.id}
              id={item.id}
              value={item.value}
              class={`cursor-pointer relative xl:w-4 xl:h-4 w-6 h-6 appearance-none rounded-[0.25rem] border outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] ${
                percent ? "" : "bg-gray-200 border-gray-200"
              }`}
              bind:group={selectedPercent}
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
          <div class="xl:text-base text-xl">
            Frequency of portfolio summary notification
          </div>
          <div class="xl:text-sm text-base text-gray-400">
            Receive portfolio summary every daily, weekly or monthly
          </div>
        </div>
        <label class="switch">
          <input type="checkbox" bind:checked={summary} />
          <span class="slider" />
        </label>
      </div>
      <div class="flex flex-col gap-3">
        {#each summaryList as item}
          <div class="flex items-center gap-2 cursor-pointer w-max">
            <input
              type="checkbox"
              disabled={!summary}
              name={item.id}
              id={item.id}
              value={item.value}
              class={`cursor-pointer relative xl:w-4 xl:h-4 w-6 h-6 appearance-none rounded-[0.25rem] border outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] ${
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
          <div class="xl:text-base text-xl">Transaction notification</div>
          <div class="xl:text-sm text-base text-gray-400">
            Receive notification whenever transaction change
          </div>
        </div>
        <label class="switch">
          <input type="checkbox" bind:checked={transaction} />
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
            bind:checked={filterSpamTrx}
          />
          <span class="slider" />
        </label>
      </div>
    </div>
  </div>
</div>

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