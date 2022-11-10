<script lang="ts">
  import Toggle from '$components/Toggle.svelte'
  import type { PricingOption } from "$lib/types";
  import { createEventDispatcher } from 'svelte';

  export let selectedOptionsPrice: number
  export let pricingOptions: PricingOption[]
  
  const dispatch = createEventDispatcher();
  const updatePrice = () => {
    let newPrice = 0
    pricingOptions.forEach((option) => {
      if (option.selected === true) newPrice += option.value
    })
    selectedOptionsPrice = newPrice
  }
</script>

<template lang="pug">
  aside(on:click|self!="{() => dispatch('closeOverlay')}" on:keydown|self!="{() => dispatch('closeOverlay')}").bg-black.bg-opacity-50.fixed.inset-0.z-50.p-8
    .bg-white.text-black
      .content-container.px-14.py-12.space-y-8

        .flex.justify-between.items-baseline
          header
            h1.inline-block.text-3xl.font-medium.pb-4.border-b-4.border-black.mb-6 Get Early Access
            p.leading-relaxed We&rsquo;re currently in a private release with early access customers. #[br.hidden.sm_block]Reserve your spot now &ndash; #[strong with no commitment] &ndash; to try us out yourself.
          p(on:click!="{() => dispatch('closeOverlay')}" on:keydown!="{() => dispatch('closeOverlay')}").cursor-pointer.icon-close.flex.items-center.justify-center.text-2xl.leading-none.w-12.h-12 &times;

        form.flex.flex-col.space-y-8

          input(type='text' placeholder='Email Address')

          .bg-gray-200.grid.grid-cols-3.gap-x-20
            .col
              h1 When?
              p We are opening access to specific features in phases. Let us know which you are interested in and we’ll reserve your spot to notify you at the right time.

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

          button.block.text-lg.font-semibold.bg-action.text-black.py-4.px-4
            .content-container Reserve My Spot

</template>