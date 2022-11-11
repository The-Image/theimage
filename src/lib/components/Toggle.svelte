<script lang="ts">
  export let active = false
  export let inactiveLabel = 'No'
  export let activeLabel = 'Yes'
  export let name: string
  export let darkBg = false
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<template lang="pug">
  div(class:darkBg class:active='{active}' on:click on:keydown tabindex='0').flex.rounded-full.p-1.bg-gray-200.text-black.-space-x-1.cursor-pointer.hover_bg-action.transition-colors.duration-200
    span(class:selected='{!active}') {inactiveLabel}
    span(class:selected='{active}') {activeLabel}
    checkbox(class='hidden' checked='{active}' name='{name}')
</template>

<style>
  span {
    @apply text-base font-medium rounded-full py-1 px-3;
  }
  .selected {
    @apply bg-black text-white;
  }
  .darkBg {
    @apply bg-white;
  }
  .active {
    @apply bg-action;
  }
</style>