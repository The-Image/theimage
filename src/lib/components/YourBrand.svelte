<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { PricingOption } from "$lib/types";
  
  const dispatch = createEventDispatcher();

  interface yourBrandItem {
    heading: string,
    heading2?: string,
    summary: string,
    contentMeta: string,
    contentMeta2?: string,
  }

  const yourBrandItems: yourBrandItem[] = [
    {
      heading: 'Endless brand possibilities.',
      summary: 'Create a brand that is truly one of a kind.',
      contentMeta: 'range of high-caliber, diverse styles',
    },
    {
      heading: 'No style out of reach.',
      summary: 'Explore – and refine – any style imaginable to perfectly express your brand.',
      contentMeta: 'searching image styles; curated styles; expanding/refining results',
    },
    {
      heading: 'Create a style all your own.',
      summary: 'Easily train our AI to produce images that perfectly reflect your brand – every time.',
      contentMeta: 'high-quality, consistent images',
    },
    {
      heading: 'Do the difficult with ease.',
      summary: 'Easily create realistic or fantastic images of brand personalities and products.',
      contentMeta: 'same object in diverse settings & styles',
    },
  ]
</script>

<template lang="pug">

  +each('yourBrandItems as item')
    section.bg-black.text-white.md_px-10.lg_px-20.flex.flex-col.min-h-screen
      .p-12.pt-16.flex.flex-col.items-center.md_grow-0
        .space-y-4.mb-8.text-center
          h1.text-4xl.font-medium
            | {item.heading}
            +if('item.heading2')
              span.block.mt-2 {item.heading2}
          p {item.summary}
        p(on:click!="{() => dispatch('showOverlay')}" on:keydown!="{() => dispatch('showOverlay')}").font-semibold.pb-2.border-b-4.border-transparent.hover_border-action.transition-colors.duration-200.cursor-pointer Get Early Access
      .p-10.bg-gray-300.text-black.flex.flex-col.items-center.justify-center.space-y-4.text-center.leading-relaxed.grow
        p {item.contentMeta}
        +if('item.contentMeta2')
          p {item.contentMeta2}

</template>