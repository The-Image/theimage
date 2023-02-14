<script lang='ts'>
  import type { workRequest, apiText2ImgResponse } from '$lib/types'
  import Logo from '$components/Logo.svelte'
  import RangeInput from '$components/RangeInput.svelte'
  import * as m from '$lib/helpers/make'
  
  let processing = false
  let processingError = false

  //- Prompts
  let imagePrompt: string = m.promptIdeas[Math.floor(Math.random() * m.promptIdeas.length)]
  let imagePromptNegative: string = m.imageDefaults.negative_prompt

  //- Guidance
  let creativity: number = (m.API_CONSTRAINTS.MAX_SCALE + 1) - m.imageDefaults.cfg // concept that is the inverse of CFG
  $: creativityPercent = m.getCreativityPercent(creativity)
  $: scale = (m.API_CONSTRAINTS.MAX_SCALE + 1) - creativity // determine corresponding CFG value

  //- Effort
  let steps: number = m.imageDefaults.steps
  $: stepsPercent = m.getStepsPercent(steps)
  
  //- Size
  let aspect: m.AspectOption = m.imageDefaults.aspect
  let size: m.SizeOption = m.imageDefaults.size
  $: width = m.imageDimensions[size][aspect].width
  $: height = m.imageDimensions[size][aspect].height

  //- Other
  let imageType: m.ImageTypeOption = m.imageDefaults.imageType
  let seedRandom: boolean = m.imageDefaults.seedRandom
  let seedValue: number | undefined = m.imageDefaults.seedValue

  //- Variations
  let variations: m.VariationOption = m.imageDefaults.variations
  let varyBy: m.VaryByAmtOption | m.VaryByKeywordOption | undefined = variations > 1 ? m.imageDefaults.varyBy : undefined
  let varyRandomly: boolean = m.imageDefaults.varyRandomly
  let varianceDir: m.varianceDir = m.imageDefaults.varianceDir
  let varianceDirAmt: number = m.imageDefaults.varianceDirAmt
  let varianceSettings: string[] = m.imageDefaults.varianceSettings
  const varianceOptionGroups = { type: m.imageTypes, style: m.imageStyles, color: m.imageColors, shot: m.imageShots }
  $: selectedVarianceOptions = varianceOptionGroups[varyBy as keyof typeof varianceOptionGroups]?.map((option) => option.label)

  //- Output
  let testApi = true
  let imageGridTallerThanViewport = false
  let imageGrid: HTMLElement
  let workRequest: workRequest
  $: workRequest = {
    imagePrompt,
    imagePromptNegative,
    creativity,
    scale,
    steps,
    aspect,
    size,
    imageType,
    seed: seedRandom ? Math.floor(Math.random() * 10000000000) : seedValue,
    variations,
    varyBy,
    varyRandomly,
    varianceDir,
    varianceDirAmt,
    varianceSettings,
  }
  let workOutput: apiText2ImgResponse[] = []
  let images: { url: string }[] = []

  const submitHandler = (e: Event) => {
    // reset
    e.preventDefault()
    workOutput = [] // remove this reset to keep scrolling list of images
    processingError = false
    processing = true

    // separate work into individual requests if needed
    const workRequests = m.getWorkRequests(workRequest)

    // make requests in parallel & update image grid
    Promise.all(workRequests.map((request) => testApi ? m.fakeApiCall(request) : m.apiCall(request)))
    .then((output) => {
      console.log('⭐️ output:', output)
      if(output[0].status === 'error') { processingError = true;  processing = false }
      if(output[0].status === 'processing') { processingError = true; console.log(`🐌 Processing - ETA: ${output[0].eta}, URL: ${output[0].fetch_result}`) }
      output.forEach((item) => { if(item.status === 'success') workOutput.push(item as apiText2ImgResponse) })
      workOutput = [...workOutput] // update svelte reactive variable
      if(imageGrid) imageGridTallerThanViewport = m.checkImageGridHeight(imageGrid, workRequest)
      processing = false
    })
    .catch((err) => {
      console.error('Error:', err)
      processingError = true
      processing = false
    })
  }

  //- TODO:
  //- [ ] connect 'seed' input value to API call
  //- [ ] connect 'image type' input value to API call
  //- [ ] update `getWorkRequests` to build requests based on `variations` and `varianceSettings`
  //- [ ] add method to follow up on `processing` responses
  //- [ ] add a 'save' button to save the image to computer

</script>

<!-- svelte-ignore a11y-autofocus -->
<!-- svelte-ignore a11y-missing-attribute -->
<template lang="pug">
  .flex.min-h-screen.text-xs

    .space-y-10.shrink-0.grow-0.py-8.px-6.max-h-screen.overflow-y-auto.bg-gray-50.text-gray-900.dark_bg-gray-800.dark_text-gray-300
      div(style='border-bottom-width: 3px' class='dark_border-b-white/50').inline-flex.shrink.dark_text-white.pb-3.border-b-gray-700
        h1.whitespace-nowrap.hidden The Image
        Logo(inlineStyles='width: 6.5rem')

      //- TODO: update to be a progressive form w/o JS
      form(on:submit='{submitHandler}' style="width: 400px").space-y-5

        //- Prompts
        .flex.items-center.space-x-4.h-10
          label(for='prompt' class='w-1/4') Create
          input(type='text' name='prompt' bind:value='{imagePrompt}' autofocus on:focus!='{(event) => event.target.select()}').w-full.h-full

        .flex.items-center.space-x-4.h-10
          label(for='negative_prompt' class='w-1/4') Avoid
          input(type='text' name='negative_prompt' bind:value='{imagePromptNegative}').w-full.h-full

        //- Guidance
        .flex.items-center.space-x-4.h-10
          label(for='creativity' class='w-1/4') Creativity
          .flex.items-center.space-x-4.w-full
            RangeInput(name='creativity' bind:value='{creativity}' min='{m.API_CONSTRAINTS.MIN_SCALE}' max='{m.API_CONSTRAINTS.MAX_SCALE}' step='0.5' classes='w-full h-full')
            input(type='hidden' name='guidance_scale' bind:value='{scale}')
            span.text-gray-400.dark_text-gray-500 {creativityPercent}

        //- Steps
        .flex.items-center.space-x-4.h-10
          label(for='num_inference_steps' class='w-1/4') Effort
          .flex.items-center.space-x-4.w-full
            RangeInput(name='num_inference_steps' bind:value='{steps}' min='{m.API_CONSTRAINTS.MIN_STEPS}' max='{m.API_CONSTRAINTS.MAX_STEPS}' step='1' classes='w-full h-full')
            span.text-gray-400.dark_text-gray-500 {stepsPercent}

        //- Image Type
        +if('varyBy !== "type"')
          .flex.items-center.space-x-4.h-10
            label(for='imageType' class='w-1/4') Type
            .flex.flex-col.space-y-2.w-full
              select(name='imageType' bind:value='{imageType}')
                option(value='any') 
                option(value='photo') Photograph
                option(value='artwork') Artwork
                option(value='vector') Vector Artwork

        //- Seed
        +if('varyBy !== "seed"')
          .flex.items-top.space-x-4
            label(for='seedValue' class='w-1/4').h-10.flex.items-center World
            .flex.flex-col.space-y-2.w-full
              .h-10.flex.items-center.space-x-4
                input(type='checkbox' name='seedRandom' bind:checked='{seedRandom}' class!='{seedRandom ? "border-none" : "border-gray-300"}')
                span.text-gray-400.dark_text-gray-500 {seedRandom ? 'Random' : 'Will be random if left blank'}
              +if('seedRandom === false')
                input(type='text' name='seedValue' placeholder='Seed' bind:value='{seedValue}').w-full.h-10

        //- Size
        .flex.items-center.space-x-4.h-10
          p(class='w-1/4') Layout
          .flex.items-center.space-x-2.w-full
            label(for='square').flex.items-center.self-stretch.pr-2
              input(type='radio' id='square' name='aspect' value='square' bind:group='{aspect}')
              span.hidden Square
              span.flex.shapes
                span.shape.w-6.h-6
            label(for='landscape').flex.items-center.self-stretch.pr-2
              input(type='radio' id='landscape' name='aspect' value='landscape' bind:group='{aspect}')
              span.hidden Landscape
              span.flex.shapes
                span.shape.w-7.h-5
            label(for='portrait').flex.items-center.self-stretch.pr-2
              input(type='radio' id='portrait' name='aspect' value='portrait' bind:group='{aspect}')
              span.hidden Portrait
              span.flex.shapes
                span.shape.w-5.h-7

        .flex.items-center.space-x-4.h-10
          label(for='size' class='w-1/4') Size
          .flex.items-center.space-x-2.w-full
            label(for='sm').flex.items-center.self-stretch.pr-2
              input(type='radio' id='sm' name='size' value='sm' bind:group='{size}')
              span.hidden Small
              span.flex.shapes
                span.shape.w-2.h-2
            label(for='md').flex.items-center.self-stretch.pr-2
              input(type='radio' id='md' name='size' value='md' bind:group='{size}')
              span.hidden Medium
              span.flex.shapes
                span.shape.w-4.h-4
            label(for='lg').flex.items-center.self-stretch.pr-2
              input(type='radio' id='lg' name='size' value='lg' bind:group='{size}')
              span.hidden Large
              span.flex.shapes
                span.shape.w-6.h-6
            label(for='xl').flex.items-center.self-stretch.pr-2
              input(type='radio' id='xl' name='size' value='xl' bind:group='{size}')
              span.hidden Extra Large
              span.flex.shapes
                span.shape.w-8.h-8

        //- Variations
        .flex.items-center.space-x-4.h-10
          label(for='variations' class='w-1/4') Options
          .flex.items-center.space-x-3.w-full
            label(for='n1').flex.items-center.self-stretch.pr-2
              input(type='radio' id='n1' name='variations' value='{1}' bind:group='{variations}')
              span.hidden One
              span.flex.shapes
                span.shape.w-2.h-2
            label(for='n3').flex.items-center.self-stretch.pr-2
              input(type='radio' id='n3' name='variations' value='{3}' bind:group='{variations}')
              span.hidden Several
              span(class="space-x-0.5").shapes.flex
                +each('new Array(3) as item')
                  span.shape.w-2.h-2
            label(for='n6').flex.items-center.self-stretch.pr-2
              input(type='radio' id='n6' name='variations' value='{6}' bind:group='{variations}')
              span.hidden Many
              span(class="gap-0.5").shapes.grid.grid-cols-3.grid-rows-2.gap-1
                +each('new Array(6) as item')
                  span.shape.w-2.h-2
            label(for='n9').flex.items-center.self-stretch.pr-2
              input(type='radio' id='n9' name='variations' value='{9}' bind:group='{variations}')
              span.hidden Tons
              span(class="gap-0.5").shapes.grid.grid-cols-3.grid-rows-2
                +each('new Array(9) as item')
                  span.shape.w-2.h-2

        +if('variations > 1')
          .flex.items-center.space-x-4.h-10
            label(for='varyBy' class='w-1/4') Vary
            .flex.flex-col.space-y-2.w-full
              select(name='varyBy' bind:value='{varyBy}')
                option(value='type') Type
                option(value='style') Style
                option(value='color') Color
                option(value='shot') Shot
                option(value='creativity') Creativity
                option(value='effort') Effort
                option(value='seed') World
          
          //- Keyword Variation Options
          +if('m.IsVaryByKeyword(varyBy)')
            .flex.items-center.space-x-4.h-10
              label(for='varyRandomly' class='w-1/4') Random
              .flex.items-center.space-x-4.w-full
                input(type='checkbox' name='varyRandomly' bind:checked='{varyRandomly}' class!='{varyRandomly ? "border-none" : "border-gray-300"}')
                +if('varyBy !== "seed"')
                  span.text-gray-400 {varyRandomly ? selectedVarianceOptions.join(', ') : 'Items left blank will be random'}
                +if('varyBy === "seed"')
                  span.text-gray-400 {varyRandomly ? "Across the multiverse" : 'Items left blank will be random'}

            +if('!varyRandomly && varyBy !== "seed"')
              +const('byCapitalizedPlural = varyBy.charAt(0).toUpperCase() + varyBy.slice(1) + "s"')
              .flex.items-top.space-x-4
                span(class='w-1/4').flex.items-center.h-10 {byCapitalizedPlural}
                .flex.flex-col.space-y-2.w-full
                  +each('new Array(variations) as item, i')
                    select(name='varianceSettings- + {i}' bind:value='{varianceSettings[i]}').w-full.h-10.placeholder_text-gray-400
                      option(value='')
                      +each('selectedVarianceOptions as option')
                        option(value='{option}') {option}

            +if('!varyRandomly && varyBy === "seed"')
              .flex.items-top.space-x-4
                span(class='w-1/4').flex.items-center.h-10 Worlds
                .flex.flex-col.space-y-2.w-full
                  +each('new Array(variations) as item, i')
                    input(type='text' name='varianceSettings- + {i}' bind:value='{varianceSettings[i]}' placeholder='Seed  {i + 1}').w-full.h-10

          //- Amount Variation Options
          +if('m.IsVaryByAmt(varyBy)')
            .flex.items-center.space-x-4.h-10
              label(for='varianceDir' class='w-1/4') By
              .flex.flex-col.space-y-2.w-full
                select(name='varianceDir' bind:value='{varianceDir}')
                  option(value='add') Add
                  option(value='subtract') Subtract
                  option(value='add-subtract') Add / Subtract
            .flex.items-center.space-x-4.h-10
              label(for='varianceDirAmt' class='w-1/4') {varianceDir === 'add' ? '+' : varianceDir === 'subtract' ? '-' : '±'}
              .flex.items-center.space-x-4.w-full
                input(type='range' name='varianceDirAmt' min='1' max='10' step='1' bind:value='{varianceDirAmt}').w-full.h-full
                span.text-gray-400 {varianceDirAmt}%

        .pt-3
          button(type='submit' disabled='{processing}') Explore

    div(bind:this='{imageGrid}' class!='{imageGridTallerThanViewport ? "items-top" : "items-center"}').flex.justify-center.grow.bg-zinc-900.max-h-screen.overflow-y-auto
      +if('processing')
        p.text-gray-400 Creating...
      +if('processingError')
        h1.text-red-400 Whoops, something went wrong.
      +if('!processing || !processingError')
        div(class!='{workOutput[1] ? "grid grid-cols-3 auto-rows-min" : ""}')
          +each('workOutput as item')
            div.relative
              .absolute.left-4.bottom-4.px-2.py-1.text-white.bg-gray-900.bg-opacity-50.rounded-sm.text-xs
                span {item.meta.seed}
              img(src='{item.image}' class='w-full')
              img(src='{item.output}' width='{item.meta.W}' height='{item.meta.H}').max-w-full.max-h-full
    
</template>

<style>
  input[type='text'], select {
    @apply text-xs text-gray-900 dark_text-white dark_focus_text-gray-900 border-2 hover_border-gray-200 border-transparent dark_border-transparent dark_hover_border-gray-400 bg-white dark_bg-gray-600;
    @apply placeholder_text-gray-400 focus_ring-action-focus focus_border-action-focus dark_focus_bg-white;
  }
  input[type='checkbox'] {
    @apply h-5 w-5 dark_bg-gray-600 text-action-focus focus_ring-action-focus focus_outline-action-focus dark_focus_ring-0 dark_focus_outline-transparent dark_border-2 dark_border-transparent dark_hover_border-gray-400;
  }
  input[type='radio'] {
    @apply h-0 w-0 overflow-hidden bg-transparent text-transparent border-none;
  } 
  input[type='radio']:focus {
    @apply outline-none ring-0 invisible;
  }
  input[type='radio']:checked ~ .shapes .shape {
    @apply bg-action-focus;
  }
  input[type='radio']:focus ~ .shapes .shape {
    @apply bg-action;
  }
  input[type='radio']:focus ~ .shapes {
    @apply outline outline-2 outline-offset-2 outline-action-focus dark_outline-white;
  }
  .shapes, .shape {
    @apply cursor-pointer;
  }
  .shape {
    @apply bg-black;
  }
  .shapes:hover .shape {
    @apply bg-action;
  }
  button {
    @apply font-medium text-sm w-full p-4;
    @apply bg-black dark_border dark_border-action/30 dark_bg-gray-700 text-white dark_text-gray-200 transition-colors duration-100;
    @apply hover_text-black hover_bg-action;
    @apply focus_text-black focus_bg-action focus_outline-none;
    @apply disabled_text-gray-400 disabled_bg-gray-200 disabled_border-transparent disabled_cursor-wait;
    @apply dark_disabled_text-gray-500 dark_disabled_bg-gray-700;
  }
</style>