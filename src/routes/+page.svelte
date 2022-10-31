<script>
  import { page } from '$app/stores'
  import Account from '$components/Account.svelte'
  import Auth from '$components/Auth.svelte'
</script>

{#if !$page.data.session}
  <Auth />
{:else}
  <Account session={$page.data.session} />
{/if}