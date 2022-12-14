import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			$actions: path.resolve('./src/lib/actions'),
			$components: path.resolve('./src/lib/components'),
			$testData: path.resolve('./src/test-data'),
		}
	}
};

export default config;
