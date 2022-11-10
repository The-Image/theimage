<script lang="ts">
  export let active = false
  export let inactiveLabel = 'No'
  export let activeLabel = 'Yes'
</script>

<template lang="pug">
  div(class:active='{active}' on:click on:keydown).flex.rounded-full.p-1.bg-gray-200.text-black.-space-x-1.cursor-pointer.hover_bg-action.transition-colors.duration-200
    span(class:selected='{!active}') {inactiveLabel}
    span(class:selected='{active}') {activeLabel}
</template>

<style>
  .active {
    @apply bg-action;
  }
  span {
    @apply text-base font-medium rounded-full py-1 px-3;
  }
  .selected {
    @apply bg-black text-white;
  }
</style>