<script lang="ts">
  import { createEventDispatcher, tick } from 'svelte';
  import type { PricingOption } from "$lib/types";
  import Toggle from '$components/Toggle.svelte'

  export let selectedOptionsPrice: number
  export let pricingOptions: PricingOption[]
  let chat = false

  // customize pricing options content for this view
  pricingOptions.filter((option) => option.name === 'animation')[0].heading = 'Animations'
  pricingOptions.filter((option) => option.name === 'cdn')[0].heading = 'Image Hosting'
  // originally tried to add use this to add note, but SK kept firing events when overlay is loaded
  // const createEditOption: PricingOption = {
  //   name: 'createEdit',
  //   heading: 'Creation & Editing',
  //   note: 'Create unlimited custom photos and illustrations – from your own text or source images. Intelligently extend the area outside of images, replace content, and upscale without quality loss.',
  //   selectable: false,
  //   selected: true,
  //   value: 99,
  //   valueText: 'Unlimited',
  // }

  let noteOpen: boolean
  let note = { heading: '', detail: '' }
  const showNote = async (option: PricingOption) => {
    // populate note
    note.heading = option.heading
    note.detail = option.note
    // show note
    noteOpen = true
    await tick()
    // if viewport narrower than 3 column layout scroll to note
    if (window.innerWidth < 1280) {
      const noteEl = await document.querySelector('#note')
      if(noteEl) noteEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  let email: string
  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
  }
  $: formValid = validateEmail(email)

  const dispatch = createEventDispatcher()
  const handleKeydown = (event: { key: any; }) => {
    if(event.key === 'Escape') dispatch('closeOverlay')
	}
  const updatePrice = () => {
    let newPrice = 0
    pricingOptions.forEach((option) => {
      if (option.selected === true) newPrice += option.value
    })
    selectedOptionsPrice = newPrice
  }
  const handleSubmit = () => {
    dispatch('closeOverlay')
    // TODO: submit form
  }
</script>

<svelte:window on:keydown={handleKeydown}/>

<!-- svelte-ignore a11y-autofocus -->
<template lang="pug">
  aside(on:click|self!="{() => dispatch('closeOverlay')}" on:keydown|self!="{() => dispatch('closeOverlay')}").bg-black.bg-opacity-50.fixed.inset-0.z-50.md_p-8.overflow-y-scroll
    
    .max-w-7xl.mx-auto.bg-white.text-black

      .flex.justify-between.items-baseline.px-8.sm_px-12.lg_px-20.pt-6.lg_pt-12.relative
        header
          h1.md_inline-block.text-2xl.md_text-3xl.font-medium.pb-4.border-b-4.border-black.mb-6 Get Early Access
          .space-y-1
            p.inline.md_block We&rsquo;re currently in a private release with early access customers. 
            p.inline.md_block Reserve your spot now &ndash; #[strong with no commitment] &ndash; to try us out&nbsp;yourself.
        p(on:click!="{() => dispatch('closeOverlay')}" on:keydown!="{() => dispatch('closeOverlay')}").cursor-pointer.icon-close.flex.items-center.justify-center.font-thin.text-2xl.leading-none.w-12.h-12.absolute.right-4.top-4.text-gray-500 &times;

      form(on:submit|preventDefault="{handleSubmit}")

        .px-8.sm_px-12.lg_px-20.pt-6.lg_pt-8.pb-8.lg_pb-10
          input(type='email' placeholder='Email Address' name='email' autofocus bind:value='{email}').w-full.h-12.border-gray-400.focus_border-action.focus_ring-action

        .bg-gray-200.space-y-10.xl_space-y-0.xl_grid.xl_grid-cols-3.gap-x-20.px-8.sm_px-12.lg_px-20.py-8.lg_py-10.relative
          .xl_col-span-2.space-y-4.md_space-y-0.md_grid.md_grid-cols-2.md_gap-x-14.md_gap-y-4.max-w-3xl

            header.col-span-2.pb-2
              h1.text-2xl.font-medium.mb-4 When?
              p.max-w-2xl We are opening access to specific features in phases. Let us know which you are interested in and we&rsquo;ll reserve your spot to notify you at the right&nbsp;time.

            .flex.items-center.justify-between.md_col-start-2.md_row-start-2.pr-8.md_pr-0.pb-4.md_pb-0.max-w-sm
              h2.font-semibold.md_font-medium.whitespace-nowrap Selected Options
              p(class='py-0.5').rounded-full.bg-black.text-white.px-6.whitespace-nowrap
                span.text-2xl.font-medium #[sup.text-sm $] {selectedOptionsPrice}
                span.text-sm.opacity-80.font-semibold / mo

            .flex.space-x-2.items-center.justify-between.md_col-start-1.md_row-start-2.relative.md_static.pr-8.md_pr-0.max-w-sm
              header.flex.space-x-2.items-center
                h2.font-medium.whitespace-nowrap Creation &amp; Editing
                //- span(on:click="{showNote(createEditOption)}" on:keydown="{showNote(createEditOption)}").icon-link.absolute.md_static.right-0: span.hidden Learn More
              span.font-medium.rounded-full.py-2.px-6.bg-black.text-white Unlimited

            +each('pricingOptions as option, i')
              //- skip first first 2 options (creation + editing; custom content for these added above)
              +if('(i > 1)')
                .space-y-3.items-baseline
                  .flex.items-baseline.justify-between.relative.md_static.pr-8.md_pr-0.max-w-sm
                    .flex.space-x-2.items-center
                      h2.font-medium.whitespace-nowrap {option.heading}
                      +if('option.note')
                        span(on:click="{showNote(option)}" on:keydown="{showNote(option)}").icon-link.absolute.md_static.right-0: span.hidden Learn More
                    +if('option.selectable === true')
                      Toggle(name='{option.name}' active='{option.selected}' darkBg=true on:click!='{() => { option.selected = !option.selected; updatePrice() }}' on:keydown!='{(event) => { if(event.key === "Enter") { option.selected = !option.selected; updatePrice() } }}')
                      +else
                        span.font-medium.rounded-full.py-2.px-6.bg-black.text-white {option.valueText}
  
          +if('noteOpen')
            #note(class='xl_w-1/3').xl_absolute.xl_top-0.xl_bottom-0.xl_right-0.xl_flex.xl_p-8.xl_pl-6
              .bg-white.p-6.xl_p-12.relative.space-y-4.max-w-3xl
                h3.xl_text-lg.font-semibold {note.heading}
                p.text-xs.italic.leading-relaxed {note.detail}
                span(on:click!="{() => noteOpen = false}" on:keydown!="{() => noteOpen = false}").flex.items-center.justify-center.font-thin.text-2xl.text-gray-500.absolute.-top-1.right-2.w-12.h-12.cursor-pointer  &times;

          .xl_col-span-1
            h1.text-2xl.font-medium.mb-4 Fast Pass?
            .space-y-6.md_space-y-4
              .max-w-2xl.space-y-4
                p.inline.xl_block Understanding your goals is incredibly valuable &ndash; especially&nbsp;now. 
                p.inline.xl_block If you&rsquo;re able to share some your time and perspective, we&rsquo;ll move your reservation ahead in&nbsp;the&nbsp;line.
              .flex.items-center.justify-between.md_justify-start.space-x-4.pr-8.mb_pr-0.max-w-sm
                p.font-medium.md_font-semibold Available for a chat?
                Toggle(name='chat' active='{chat}' darkBg=true on:click!='{() => { chat = !chat}}' on:keydown!='{(event) => { if(event.key === "Enter") { chat = !chat}}}')

        button(type='submit' disabled="{!formValid}").block.w-full.text-lg.font-semibold.text-black.py-6.px-4.bg-action.hover_bg-action-hover.transition-colors.duration-200.disabled_bg-gray-400.disabled_cursor-not-allowed
          .content-container Reserve My Spot

</template>

<style>
  .icon-link {
    background-image: url('icon-question.svg');
    @apply p-2 md_p-4 cursor-pointer bg-center bg-no-repeat;
  }
</style>