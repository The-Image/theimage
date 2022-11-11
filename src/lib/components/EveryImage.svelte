<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { PricingOption } from "$lib/types";
  const dispatch = createEventDispatcher();

  interface everyImageItem {
    heading: string,
    heading2?: string,
    summary: string,
    contentMeta: string,
    contentMeta2?: string,
  }

  const everyImageItems: everyImageItem[] = [
    {
      heading: 'Stock no more.',
      heading2: 'Create the perfect image for every need.',
      summary: 'Elevate your brand to amazing with world class, brand unique imagery – without an art department.',
      contentMeta: 'common branding into high-caliber branding',
      contentMeta2: 'pages, social, ads, photos, illustrations,animations',
    },
    {
      heading: 'Never be at a loss for ideas – or creativity.',
      summary: 'Find inspiration from your brand content. Easily explore and refine new concepts. No art or science degree required.',
      contentMeta: 'text to images; image to images, article to text summary',
    },
    {
      heading: 'Be exceptionally one of a kind.',
      summary: 'Explore and craft the visual language that will set your brand apart from the competition.',
      contentMeta: 'diverse image styles; photographs, illustrations',
    },
    {
      heading: 'Create the ideal image – automagically.',
      summary: 'Easily refine images in a few clicks to achieve the precise look you need using state of the art editing.',
      contentMeta: 'images being edited; expanded canvas, object replacement, enhanced resolution',
    },
    {
      heading: 'Breath life into your brand.',
      summary: 'From subtle to surreal, create captivating animations that tell your story in whole new ways.',
      contentMeta: 'variety of animated image sequences',
    },
  ]
</script>

<template lang="pug">

  +each('everyImageItems as item')
    section.grid.grid-rows-2.md_grid-rows-1.md_grid-cols-3.lg_grid-cols-2.min-h-screen
      .p-20.flex.flex-col.items-start.justify-center.md_row-start-1.md_col-start-2.md_col-span-2.lg_col-span-1
        .space-y-6.mb-8.max-w-sm
          h1.text-4xl.font-medium
            | {item.heading}
            +if('item.heading2')
              span.block.mt-2 {item.heading2}
          p.text-lg.font-medium.max-w-xs {item.summary}
        p(on:click!="{() => dispatch('showOverlay')}" on:keydown!="{() => dispatch('showOverlay')}").text-lg.font-semibold.pb-2.border-b-4.border-transparent.hover_border-action.transition-colors.duration-200.cursor-pointer Get Early Access
      .p-10.bg-gray-300.flex.flex-col.items-center.justify-center.space-y-4.md_row-start-1.md_col-start-1.text-center.leading-relaxed
        p {item.contentMeta}
        +if('item.contentMeta2')
          p {item.contentMeta2}

</template>

<style>
  section {
    -moz-hyphens: none;
    -webkit-hyphens: none;
    hyphens: none;
  }
</style>