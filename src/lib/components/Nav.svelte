<script lang='ts'>
  const links = [
    { href: '#every', label: 'Every Image' },
    { href: '#yours', label: 'Your Brand' },
    { href: '#effortless', label: 'Effortless' },
    { href: '#pricing', label: 'Pricing' },
  ]
  const navigate = (href: string) => {
    if (href.startsWith('/')) {
      window.location.href = href
    }
    if (!href.startsWith('/')) {
      const el = document.querySelector('#' + href)
      if (el) el.scrollIntoView()
    }
  }
  export let inview: string
</script>

<template lang="pug">
  nav.bg-black.text-white.sticky.top-0.z-50
    .content-container.h-20.flex.items-center.relative
      a(href='#home').h-full.inline-flex.flex-none.items-center.border-b-4.border-white.absolute.top-0.left-10.sm_left-12.lg_left-20.bottom-0
        h1.whitespace-nowrap.hidden The Image
        img.w-28.rounded-lg(src='logo_white.svg' alt="logo")
      .hidden.md_flex.md_grow.space-x-5.justify-center
        +each('links as link')
          a(href='{link.href}' class="{'#' + inview === link.href ? 'active' : ''}").link {link.label}
      .hidden.md_block.absolute.right-10.sm_right-12.lg_right-20
        a(href='/login').px-4.py-1.border-2.border-white.border-opacity-30
          span.text-xs.font-medium.leading-none.tracking-wide Login
      select(bind:value='{inview}' on:change='{navigate(inview)}').md_hidden.bg-transparent.border-none.text-xs.font-medium.absolute.right-10.sm_right-12.text-right.focus_outline-none.focus_ring-0
        option(value='home') Menu
        option(value='every') Every Image
        option(value='yours') Your Brand
        option(value='effortless') Effortless
        option(value='pricing') Pricing
        option(value='/login') Login
</template>

<style>
  .link {
    @apply text-xs font-medium tracking-wider leading-none whitespace-nowrap px-3 lg_px-4 py-2 hover_bg-action hover_text-black transition-colors duration-100;
  }
  .link.active {
    @apply bg-action text-black transition-colors duration-200;
  }
</style>