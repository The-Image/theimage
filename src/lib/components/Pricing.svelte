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
          p.text-xl.font-medium.whitespace-nowrap Selected Options
          p(class='py-0.5').rounded-full.bg-black.text-white.px-6.whitespace-nowrap
            span.text-3xl.font-medium #[sup.text-lg $] {selectedOptionsPrice}
            span.text-sm.opacity-80.font-semibold / mo
        ul.col-span-2.grid.grid-cols-2.gap-x-20.gap-y-8
          +each('pricingOptions as option')
            li.space-y-4.items-baseline
              .flex.items-baseline.justify-between
                .flex.space-x-2.items-center
                  h2.text-lg.font-semibold {option.heading}
                +if('option.selectable === true')
                  Toggle(name='{option.name}' active='{option.selected}' on:click!='{() => { option.selected = !option.selected; updatePrice() }}' on:keydown!='{(event) => { if(event.key === "Enter") { option.selected = !option.selected; updatePrice() } }}')
                  +else
                    span.text-lg.font-semibold.rounded-full.py-2.px-6.bg-black.text-white {option.valueText}
              p.text-sm.italic.pr-12.xl_pr-32 {option.note}
  
</template>