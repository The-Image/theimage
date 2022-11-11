<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { PricingOption } from "$lib/types";
  
  export let cmsName: string
  
  const dispatch = createEventDispatcher();

  interface effortlessItem {
    heading: string,
    heading2?: string,
    summary: string,
    contentMeta: string,
    contentMeta2?: string,
  }

  const effortlessItems: effortlessItem[] = [
    {
      heading: 'Powerfully simple.',
      summary: 'Easily leverage the full power of AI image generation using world-class tools.',
      contentMeta: 'complex technology; user-friendly interface',
    },
    {
      heading: 'The creative process, made reliable.',
      summary: 'From inspiration to execution, our tools give you the power to bring your vision to life.',
      contentMeta: 'inspiration → exploration → refinement',
    },
    {
      heading: 'Your marketing brought to life.',
      summary: 'Get high-quality, on-brand images for any piece of content with just a few clicks.',
      contentMeta: 'Hubspot content types; range of coherent images',
    },
  ]
  if (cmsName === 'Hubspot') effortlessItems[2].heading = 'Hubspot marketing brought to life.'
</script>

<template lang="pug">

  +each('effortlessItems as item')
    section.grid.grid-rows-2.md_grid-rows-1.md_grid-cols-3.lg_grid-cols-2.min-h-screen
      .p-20.flex.flex-col.items-start.justify-center.md_col-span-2.lg_col-span-1
        .space-y-6.mb-8.max-w-sm
          h1.text-4xl.font-medium
            | {item.heading}
            +if('item.heading2')
              span.block.mt-2 {item.heading2}
          p.text-lg.font-medium.max-w-xs {item.summary}
        p(on:click!="{() => dispatch('showOverlay')}" on:keydown!="{() => dispatch('showOverlay')}").text-lg.font-semibold.pb-2.border-b-4.border-transparent.hover_border-action.transition-colors.duration-200.cursor-pointer Get Early Access
      .p-10.bg-gray-300.flex.flex-col.items-center.justify-center.space-y-4.text-center.leading-relaxed
        p {item.contentMeta}
        +if('item.contentMeta2')
          p {item.contentMeta2}

</template>