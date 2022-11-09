<template lang="pug">
  .bg-black.text-white

    //- Lead
    .content-container.text-center.pt-20.pb-14
      hgroup
        h1.font-semibold.tracking-tight.text-4xl.sm_text-5xl.mb-8 Create professional photography &amp; illustrations #[span.lg_whitespace-nowrap that are 100%] on brand  #[span.whitespace-nowrap —  in seconds].
        h2.mx-auto.max-w-xl.text-xl.text-gray-300.mb-12 Easily utilize the latest AI to create professional, original images from your Hubspot content.
        p.button Get Early Access

    //- Video
    .max-w-7xl.mx-auto.lg_px-20
      .bg-white.bg-opacity-30.w-full.aspect-video

    //- Abilities
    .content-container.grid.md_grid-cols-2.lg_grid-cols-3.gap-x-20.gap-y-12.md_gap-y-16.py-16
      a(href='#create').ability
        h2 Infinite Image Creation
        p Create unlimited custom photos and illustrations &ndash; from your own text or source&nbsp;images.
        .icon-link: span.hidden Learn More
      a(href='#edit').ability
        h2 Intelligent Editing
        p Intelligently extend the area outside of images, replace content, and upscale without quality&nbsp;loss.
        .icon-link: span.hidden Learn More
      a(href='#bespoke-styles').ability
        h2 Bespoke Styles
        p Create new, discrete styles from your brand imagery to aid image creation and&nbsp;consistency.
        .icon-link: span.hidden Learn More
      a(href='#custom-objects').ability
        h2 Custom Objects
        p Recreate specific items, people, and products &ndash; allowing them to be incorporated into any&nbsp;image.
        .icon-link: span.hidden Learn More
      a(href='#animations').ability
        h2 Animated Images
        p Create dynamic animated image sequences that rival professional hand-drawn&nbsp;animations.
        .icon-link: span.hidden Learn More
      .ability.order-2.lg_order-none
        h2 Performant Delivery
        p Deliver your images with maximum speed to viewers and sized correctly across&nbsp;devices.
      a(href='#cms-automation').ability
        h2 Hubspot Automation
        p Easily create images from your content in Hubspot and publish them back&nbsp;automatically.
        .icon-link: span.hidden Learn More
      .ability
        h2 Multiple Brands
        p Easily create and manage images, styles, and preferences for multiple&nbsp;brands.

</template>

<style>
  .ability {
    @apply relative;
  }
  .ability h2 {
    @apply text-lg font-semibold mb-4;
  }
  .ability p {
    @apply text-sm opacity-80 pr-16;
  }
  .ability .icon-link {
    background-image: url('icon-question.svg');
    @apply block absolute top-0 right-0 bg-action hover_bg-action-hover p-4 cursor-pointer bg-center bg-no-repeat;
  }
</style>