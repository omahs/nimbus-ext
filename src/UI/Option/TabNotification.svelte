<svelte:options tag="tab-notification" />

<script>
  import { i18n } from "~/lib/i18n";
  const MultipleLang = {
    title: i18n("optionsPage.notification-page-title", "Notification"),
  };
</script>

<div class="flex flex-col gap-2">
  <div class="title-3 text-gray-500 mb-2">{MultipleLang.title}</div>
  <div class="title-5">Comming soon...</div>
</div>

<style>
</style>