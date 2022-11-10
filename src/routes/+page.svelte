<script lang='ts'>
  import { intersectionAPI } from "$actions/observer";
  import type { PricingOption } from "$lib/types";
  import Nav from '$components/Nav.svelte'
  import Hero from '$components/Hero.svelte'
  import EveryImage from '$components/EveryImage.svelte'
  import YourBrand from '$components/YourBrand.svelte'
  import Effortless from '$components/Effortless.svelte'
  import Message from '$components/Message.svelte'
  import Pricing from '$components/Pricing.svelte'
  import CTA from '$components/CTA.svelte'
  import Footer from '$components/Footer.svelte'
  import EarlyAccessOverlay from '$components/EarlyAccessOverlay.svelte'

  let selectedOptionsPrice = 99
  let pricingOptions: PricingOption[] = [
    { 
      option: 'Image Creation',
      note: 'Create unlimited custom photos and illustrations – from your own text or  source images.',
      link: '#create',
      selectable: false,
      selected: true,
      value: 50,
      valueText: 'Unlimited',
    },
    { 
      option: 'Intelligent Editing',
      note: 'Intelligently extend the area outside of images, replace content, and upscale without quality loss.',
      link: '#edit',
      selectable: false,
      selected: true,
      value: 49,
      valueText: 'Unlimited',
    },
    { 
      option: 'Bespoke Styles',
      note: 'Create new, discrete styles from your brand imagery to aid image creation and consistency.',
      link: '#bespoke-styles',
      selectable: true,
      selected: false,
      value: 50,
    },
    { 
      option: 'Custom Objects',
      note: 'Recreate specific items, people, and products – allowing them to be incorporated into any image.',
      link: '#custom-objects',
      selectable: true,
      selected: false,
      value: 50,
    },
    { 
      option: 'Animated Images',
      note: 'Create dynamic animated image sequences that rival professional hand-drawn animations.',
      link: '#animations',
      selectable: true,
      selected: false,
      value: 100,
    },
    { 
      option: 'Hubspot Automation',
      note: 'Easily create images from your content in Hubspot and publish them back automatically.',
      link: '#cms-automation',
      selectable: true,
      selected: false,
      value: 50,
    },
    { 
      option: 'Performant Delivery',
      note: 'Deliver your images with maximum speed to viewers and sized correctly across devices.',
      selectable: true,
      selected: false,
      value: 100,
    },
    { 
      option: 'Multiple Brands',
      note: 'Easily create and manage images, styles, and preferences for multiple brands.',
      selectable: true,
      selected: false,
      value: 300,
    },
  ]

  let inview: string
  let showOverlay: boolean = false

  const showOverlayHandler = () => showOverlay = true
  const reportView = (entry: IntersectionObserverEntry) => { if (entry.isIntersecting) inview = entry.target.id }
</script>

<template lang="pug">
  Nav('{inview}')
  #home(use:intersectionAPI on:inview!='{(e) => inview = "home"}')
    Hero('{pricingOptions}' on:showOverlay='{showOverlayHandler}')
  #every(use:intersectionAPI on:inview!='{(e) => reportView(e.detail)}')
    EveryImage
  #yours(use:intersectionAPI  on:inview!='{(e) => reportView(e.detail)}')
    YourBrand
  #effortless(use:intersectionAPI  on:inview!='{(e) => reportView(e.detail)}')
    Effortless
  Message
  #pricing(use:intersectionAPI  on:inview!='{(e) => reportView(e.detail)}')
    Pricing('{pricingOptions}' '{selectedOptionsPrice}')
  CTA(on:showOverlay='{showOverlayHandler}')
  Footer
  +if('showOverlay')
    EarlyAccessOverlay('{pricingOptions}' '{selectedOptionsPrice}' on:closeOverlay!='{(e) => showOverlay = false}')
</template>