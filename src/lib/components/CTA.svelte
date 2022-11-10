<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<template lang="pug">
  section.bg-action.text-black
    .content-container.flex.items-center.justify-center.py-16.space-x-8
      p.font-semibold.text-lg &lsquo;It feels like magic&rsquo;
      p.button.reverse(on:click!="{() => dispatch('showOverlay')}" on:keydown!="{() => dispatch('showOverlay')}").bg-black.text-white Get Early Access
      p.font-semibold.text-lg Find out first hand.
</template>