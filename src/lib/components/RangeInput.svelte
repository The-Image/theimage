<script lang='ts'>
  export let name: string
  export let value: number
  export let min: number
  export let max: number
  export let step: number
  export let classes: string
</script>

<template lang="pug">
  input(type='range' name='{name}' min='{min}' max='{max}' step='{step}' bind:value='{value}' class='{classes}')
</template>

<style>
  input[type='range'] {
    @apply appearance-none bg-transparent w-full;
  }
  input[type=range]:focus {
    @apply outline-none;
  }

  input[type='range']::-webkit-slider-runnable-track {
    @apply appearance-none bg-gray-200 dark_bg-gray-600 border-transparent text-transparent w-full h-2 cursor-pointer;
  } 
  input[type='range']::-moz-range-track {
    @apply appearance-none bg-gray-200 dark_bg-gray-600 border-transparent text-transparent w-full h-2 cursor-pointer;
  }
  input[type='range']::-ms-track {
    @apply appearance-none bg-gray-200 dark_bg-gray-600 border-transparent text-transparent w-full h-2 cursor-pointer;
  }
  
  input[type="range"]:focus::-webkit-slider-runnable-track {
    @apply bg-action-lighter dark_bg-gray-400;
  }
  input[type="range"]:focus::-moz-range-track {
    @apply bg-action-lighter dark_bg-gray-400;
  }
  input[type="range"]:focus::-ms-track {
    @apply bg-action-lighter dark_bg-gray-400;
  }

  input[type='range']::-webkit-slider-thumb {
    @apply appearance-none h-4 w-4 border-none rounded-full bg-action dark_bg-action-focus -mt-1 shadow-sm cursor-pointer;
  }
  input[type="range"]::-webkit-slider-thumb:hover,
  input[type="range"]:focus::-webkit-slider-thumb {
    @apply bg-action-focus outline outline-2 outline-action-focus outline-offset-2;
  }
  input[type='range']::-moz-range-thumb {
    @apply appearance-none h-4 w-4 border-none rounded-full bg-action dark_bg-action-focus -mt-2 shadow-sm cursor-pointer;
  }
  input[type="range"]::-moz-range-thumb:hover,
  input[type="range"]:focus::-moz-range-thumb {
    @apply bg-action-focus dark_bg-action outline outline-2 outline-action-focus dark_outline-white outline-offset-2;
  }
  input[type='range']::-ms-thumb {
    @apply appearance-none h-4 w-4 border-none rounded-full bg-action dark_bg-action-focus -mt-2 shadow-sm cursor-pointer;
  }
  input[type="range"]::-ms-thumb:hover,
  input[type="range"]:focus::-ms-thumb {
    @apply bg-action-focus outline outline-2 outline-action-focus outline-offset-2;
  }

  input[type="range"]::-moz-range-progress {
    @apply bg-action-light dark_bg-action-light h-2;
  }
</style>