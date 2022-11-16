<script lang='ts'>
  import RangeInput from '$components/RangeInput.svelte'
  import Logo from '$components/Logo.svelte'
  
  //- API Constraints
  const MIN_STEPS = 1
  const MAX_STEPS = 50
  const MIN_SCALE = 1
  const MAX_SCALE = 20

  //- Prompts
  const promptIdeas = [
    'a young girl playing basketball',
    'a happy family traveling',
    'writing a book',
    'the endless ocean',
    'the power of love',
  ]
  let image: string = promptIdeas[Math.floor(Math.random() * promptIdeas.length)]
  let not: string

  //- Guidance
  let creativity: number = (MAX_SCALE + 1) - 7.5 // create a concept that is the inverse of CFG
  $: creativityPercent = getCreativityPercent(creativity)
  const getCreativityPercent = (creativityValue: number) => {
    const percent = Math.round(creativityValue * 100 / MAX_SCALE)
    if (percent === 5) return 'Min'
      else if (percent === 100) return 'Max'
      else return percent + '%'
  }
  $: scale = (MAX_SCALE + 1) - creativity // create the corresponding CFG value

  //- Effort
  let steps: number = 20
  $: stepsPercent = getStepsPercent(steps)
  const getStepsPercent = (stepsValue: number) => {
    const percent = Math.round(stepsValue * 100 / MAX_STEPS)
    if (percent === 2) return 'Min'
      else if (percent === 100) return 'Max'
      else return percent + '%'
  }

  //- Size
  let aspect: 'square' | 'landscape' | 'portrait' = 'square'
  let size: 'sm' | 'md' | 'lg' | 'xl' = 'md'
  const sizes = {
      sm: {
        square: { width: 256, height: 256 },
        landscape: { width: 256, height: 176 },
        portrait: { width: 176, height: 256 }
      },
      md: {
        square: { width: 528, height: 528 },
        landscape: { width: 528, height: 384 },
        portrait: { width: 384, height: 528 }
      },
      lg: {
        square: { width: 768, height: 768 },
        landscape: { width: 768, height: 512 },
        portrait: { width: 512, height: 768 }
      },
      xl: {
        square: { width: 1024, height: 1024 },
        landscape: { width: 1024, height: 768 },
        portrait: { width: 768, height: 1024 }
      }
    }
  $: width = sizes[size][aspect].width
  $: height = sizes[size][aspect].height

  //- Variations
  let variations = 1 //- 1, 3, 6, 9
  type VaryByAmt = 'creativity' | 'effort'
  type VaryByKeyword = 'type' | 'style' | 'color' | 'shot' | 'seed'
  const IsVaryByAmt = (word: string): word is VaryByAmt => { return word === 'creativity' || word === 'effort' }
  const IsVaryByKeyword = (word: string): word is VaryByKeyword => { return word === 'type' || word === 'style' || word === 'color' || word === 'shot' || word === 'seed' }
  let varyBy: VaryByKeyword | VaryByKeyword = 'type'
  let varianceRandom = true
  let varianceDir: 'add' | 'subtract' | 'add-subtract' = 'add'
  let varianceDirAmt: number = 5
  let varianceSettings: number[] = []
  const imageTypes = ['Photo', 'Illustration', 'Vector Art']
  const imageStyles = ['Realistic', 'Abstract', 'Cartoon']
  const imageColors = ['Natural', 'Grayscale', 'Vibrant']
  const imageShots = ['Close Up', 'Medium', 'Wide', 'Extra Wide']
  const varianceOptions = { type: imageTypes, style: imageStyles, color: imageColors, shot: imageShots }

  //- Placeholder Images
  const createPlaceholderImages = () => {
    images = []
    for (let i = 0; i < variations; i++)
      images.push(`https://picsum.photos/seed/${Math.floor(Math.random() * 999999).toString(16)}/${width}/${height}`)
  }

  //- Output
  let images: string[] = []
  const submitHandler = (e: Event) => {
    e.preventDefault()
    createPlaceholderImages()
    
    // capture form data
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
    
    // send to API
    // update images
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
<!-- svelte-ignore a11y-missing-attribute -->
<template lang="pug">
  .flex.min-h-screen.text-xs

    .space-y-10.shrink-0.grow-0.py-8.px-6.max-h-screen.overflow-y-auto.bg-gray-50.text-gray-900.dark_bg-gray-800.dark_text-gray-300
      .inline-flex.shrink.dark_text-white
        h1.whitespace-nowrap.hidden The Image
        Logo(inlineStyles='width: 6.5rem')

      form(method='post' action='/api/make' on:submit='{submitHandler}' style="width: 400px").space-y-5

        //- Prompts
        .flex.items-center.space-x-4.h-10
          label(for='prompt' class='w-1/4') Create
          input(type='text' name='prompt' bind:value='{image}' autofocus on:focus!='{(event) => event.target.select()}').w-full.h-full

        .flex.items-center.space-x-4.h-10
          label(for='negative_prompt' class='w-1/4') Avoid
          input(type='text' name='negative_prompt' bind:value='{not}' on:focus!='{(event) => event.target.select()}').w-full.h-full

        //- Guidance
        .flex.items-center.space-x-4.h-10
          label(for='creativity' class='w-1/4') Creativity
          .flex.items-center.space-x-4.w-full
            RangeInput(name='creativity' bind:value='{creativity}' min='{MIN_SCALE}' max='{MAX_SCALE}' step='0.5' classes='w-full h-full')
            input(type='hidden' name='guidance_scale' bind:value='{scale}')
            span.text-gray-400.dark_text-gray-500 {creativityPercent}

        //- Steps
        .flex.items-center.space-x-4.h-10
          label(for='num_inference_steps' class='w-1/4') Effort
          .flex.items-center.space-x-4.w-full
            RangeInput(name='num_inference_steps' bind:value='{steps}' min='{MIN_STEPS}' max='{MAX_STEPS}' step='1' classes='w-full h-full')
            span.text-gray-400.dark_text-gray-500 {stepsPercent}

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
          +if('IsVaryByKeyword(varyBy)')
            .flex.items-center.space-x-4.h-10
              label(for='varianceRandom' class='w-1/4') Random
              .flex.items-center.space-x-4.w-full
                input(type='checkbox' name='varianceRandom' bind:checked='{varianceRandom}' class!='{varianceRandom ? "border-none" : "border-gray-300"}')
                +if('varyBy !== "seed"')
                  span.text-gray-400 {varianceRandom ? varianceOptions[varyBy].join(', ') : 'Items left blank will be random'}
                +if('varyBy === "seed"')
                  span.text-gray-400 {varianceRandom ? "Across the multiverse" : 'Items left blank will be random'}

            +if('!varianceRandom && varyBy !== "seed"')
              +const('byCapitalizedPlural = varyBy.charAt(0).toUpperCase() + varyBy.slice(1) + "s"')
              .flex.items-top.space-x-4
                span(class='w-1/4').flex.items-center.h-10 {byCapitalizedPlural}
                .flex.flex-col.space-y-2.w-full
                  +each('new Array(variations) as item, i')
                    select(name='varianceSettings- + {i}' bind:value='{varianceSettings[i]}').w-full.h-10.placeholder_text-gray-400
                      option(value='')
                      +each('varianceOptions[varyBy] as option')
                        option(value='{option}') {option}

            +if('!varianceRandom && varyBy === "seed"')
              .flex.items-top.space-x-4
                span(class='w-1/4').flex.items-center.h-10 Worlds
                .flex.flex-col.space-y-2.w-full
                  +each('new Array(variations) as item, i')
                    input(type='text' name='varianceSettings- + {i}' bind:value='{varianceSettings[i]}' placeholder='Seed  {i + 1}').w-full.h-10.placeholder_text-gray-400

          //- Amount Variation Options
          +if('IsVaryByAmt(varyBy)')
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
          button(type='submit') Explore

    div(class!='{images[6] ? "items-top" : "items-center"}').flex.justify-center.grow.bg-zinc-900.max-h-screen.overflow-y-auto
      div(class!='{images[1] ? "grid grid-cols-3" : ""}')
        +each('images as image')
          img(src='{image}').object-contain
    
</template>

<style>
  input[type='text'], select {
    @apply text-xs text-gray-900 dark_text-white dark_focus_text-gray-900 border-gray-200 dark_border-gray-400 bg-white dark_bg-gray-600;
    @apply focus_ring-action-focus focus_border-action-focus dark_focus_bg-white;
  }
  input[type='checkbox'] {
    @apply h-5 w-5 text-action-focus focus_ring-action-focus focus_outline-action-focus dark_focus_ring-0 dark_focus_outline-transparent;
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
    @apply bg-black dark_bg-opacity-50;
  }
  .shapes:hover .shape {
    @apply bg-action;
  }
  button {
    @apply font-semibold text-sm w-full p-4;
    @apply bg-black dark_border dark_border-action/30 dark_bg-gray-700 text-white dark_text-gray-200 transition-colors duration-100;
    @apply hover_text-black hover_bg-action;
    @apply focus_text-black focus_bg-action focus_outline-none;
  }
</style>