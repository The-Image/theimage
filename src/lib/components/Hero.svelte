<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { PricingOption } from "$lib/types";

  export let cmsName: string
  export let pricingOptions: PricingOption[]

  const dispatch = createEventDispatcher();
</script>

<template lang="pug">
  section.bg-black.text-white.pt-20.relative

    //- Lead
    .content-container.text-center.pb-14
      hgroup
        h1.font-semibold.tracking-tight.text-4xl.sm_text-5xl.mb-8 Create professional photography &amp; illustrations #[span.lg_whitespace-nowrap that are 100%] on brand  #[span.whitespace-nowrap —  in seconds].
        h2.mx-auto.max-w-xl.text-xl.text-gray-300.mb-12 Easily utilize the latest AI to create professional, original&nbsp;images from your {cmsName === 'Hubspot' ? 'Hubspot content' : "brand’s content"}.
        p.button(on:click!="{() => dispatch('showOverlay')}" on:keydown!="{() => dispatch('showOverlay')}") Get Early Access

    //- Video
    .max-w-7xl.mx-auto.lg_px-20
      .bg-white.bg-opacity-30.w-full.aspect-video

    //- Abilities
    .content-container.grid.md_grid-cols-2.lg_grid-cols-3.gap-x-20.gap-y-12.md_gap-y-14.py-16
      +each('pricingOptions as option')
        +if('option.link')
          a(href='{option.link}').ability
            h2 {option.heading === 'Image Creation' ? 'Infinite Image Creation' : option.heading}
            p.pr-8 {option.note}
            .icon-link: span.hidden Learn More
          +else
          .ability
            h2 {option.heading}
            p.pr-8 {option.note}

    .accent

</template>

<style>
  .ability {
    @apply relative;
  }
  .ability h2 {
    @apply text-lg font-semibold mb-4;
  }
  .ability p {
    @apply text-sm opacity-80;
  }
  .ability .icon-link {
    background-image: url('icon-question.svg');
    @apply block absolute top-0 right-0 bg-action hover_bg-action-hover p-4 cursor-pointer bg-center bg-no-repeat;
  }
  .accent {
    @apply absolute z-10 right-0 h-0 w-0 border-solid border-y-transparent border-l-transparent border-r-gray-500;
    @apply border-t-[8vh] border-r-[55vw] border-b-[4vh] border-l-0 -bottom-16;
    @apply md_border-t-[8vh] md_border-r-[40vw] md_border-b-[6vh] md_-bottom-20;
    @apply lg_border-t-[18vh] lg_border-r-[40vw] lg_border-b-[7vh] lg_-bottom-24;
    @apply 2xl_border-r-[30vw];
  }
</style>