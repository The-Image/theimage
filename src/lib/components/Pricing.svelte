<script lang="ts">
  import Toggle from '$components/Toggle.svelte'
  import type { PricingOption } from "$lib/types";
  
  export let selectedOptionsPrice: number
  export let pricingOptions: PricingOption[]

  const updatePrice = () => {
    let newPrice = 0
    pricingOptions.forEach((option) => {
      if (option.selected === true) newPrice += option.value
    })
    selectedOptionsPrice = newPrice
  }
</script>

<template lang="pug">
  section.bg-white.text-black.pt-16.pb-20
    .content-container.space-y-10
      header.space-y-4
        h1.text-3xl.font-medium Pricing
        p.text-lg.font-medium Everyone&rsquo;s needs are different. Pay only for the abilities that are useful to your&nbsp;business&nbsp;&ndash;
      .grid.grid-cols-2.gap-x-20.gap-y-10
        .flex.w-half.items-baseline.justify-between
          p.text-xl.font-medium Selected Options
          p(class='py-0.5').rounded-full.bg-black.text-white.px-6
            span.text-3xl.font-medium #[sup.text-lg $] {selectedOptionsPrice}
            span.text-sm.opacity-80.font-semibold / mo
        ul.col-span-2.grid.grid-cols-2.gap-x-20.gap-y-10
          +each('pricingOptions as option')
            li.space-y-3.items-baseline
              .flex.items-baseline.justify-between
                .flex.space-x-2.items-center
                  h2.text-lg.font-semibold {option.option}
                  +if('option.link')
                    a(href='{option.link}').icon-link: span.hidden Learn More
                +if('option.selectable === true')
                  Toggle(active='{option.selected}' on:click!='{() => { option.selected = !option.selected; updatePrice() }}')
                  +else
                    span.text-lg.font-medium.rounded-full.py-2.px-6.bg-action.text-black {option.valueText}
              p.text-sm.italic.pr-12.xl_pr-32 {option.note}
  
</template>

<style>
  .icon-link {
    background-image: url('icon-question.svg');
    @apply p-4 cursor-pointer bg-center bg-no-repeat;
  }
</style>