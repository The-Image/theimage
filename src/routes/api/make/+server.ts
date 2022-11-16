import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private'

export const POST: RequestHandler = async ({ params }) => {
    console.log('⭐️ params:', params)

    const success = true
    
    if (!success) {
        throw error(400, 'Unable to process request');
    }
    
    return new Response(String(env.SD_API_KEY));
};