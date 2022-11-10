<script lang="ts">
  const year = new Date().getFullYear()
</script>

<template lang="pug">
  footer.bg-black.text-white
    .content-container.flex.items-center.justify-between
      .flex.space-x-8.pt-14.pb-12
        a(href='#home').h-full.inline-flex.flex-none.items-center.border-b-4.border-white.pb-4
          h1.whitespace-nowrap.hidden The Image
          img.w-28.rounded-lg(src='logo_white.svg' alt="logo")
        a(href='mailto:hello@theimage.ai').hover_text-action.transition-colors.duration-200 hello@theimage.ai
      p.opacity-75 &copy; {year} All Rights Reserved
</template>