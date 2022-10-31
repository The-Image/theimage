<script lang="ts">
	import { supabaseClient } from '$lib/supabaseClient'
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	import '../app.css';

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('supabase:auth')
		})
		return () => {
			subscription.unsubscribe()
		}
	})
</script>

<template lang="pug">

	//- .min-h-screen.flex.flex-col
	.container(style='padding: 50px 0 100px 0')
		slot

</template>
