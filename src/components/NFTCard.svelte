<script lang="ts">
  import Nimbus from "~/assets/nimbus-nft.jpg";
</script>

<div class="card-border flex flex-col rounded-xl overflow-hidden">
  <img src={Nimbus} alt="Nimbus NFT" height="350" />
  <div class="px-4 py-3 flex justify-between gap-5">
    <div class="flex-1 flex flex-col py-1">
      <div class="text-sm text-gray-500 font-regular">Price</div>
      <div class="text-black font-medium">2 SOL | $276,542</div>
    </div>
    <div class="border" />
    <div class="flex-1 flex flex-col py-1">
      <div class="text-sm text-gray-500 font-regular">Payment</div>
      <div class="text-black font-medium">Solana</div>
    </div>
  </div>
</div>

<style>
  .card-border {
    border: 1px solid rgb(229, 231, 235);
  }

  .border {
    border-left: 1px solid rgb(229, 231, 235);
  }
</style>