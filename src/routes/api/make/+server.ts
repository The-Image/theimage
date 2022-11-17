import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private'
import * as m from '$lib/helpers/make'
import type { RequestHandler } from './$types';
import type { workRequest, apiText2ImgRequest, apiText2ImgResponse } from "$lib/types";

export const POST: RequestHandler = async ({ request }) => {
  const requestData: workRequest = await request.json()
  const apiRequestBody = createApiRequestBody(requestData)
  const apiCall: apiText2ImgResponse = await submitJson(apiRequestBody)

  const success = apiCall.status === 'success'
  if (!success) throw error(400, 'Unable to process request')

  return json(apiCall)
};

const createApiRequestBody = (workRequest: workRequest): apiText2ImgRequest => {
  const size = workRequest.size as keyof typeof m.imageDimensions
  const aspect = workRequest.aspect as keyof typeof m.imageDimensions[typeof size]
  const { width, height } = m.imageDimensions[size][aspect]
  const requestBody: apiText2ImgRequest = {
    key: env.SD_API_KEY,
    prompt: workRequest.imagePrompt,
    negative_prompt: workRequest.imagePromptNegative,
    guidance_scale: workRequest.scale,
    num_inference_steps: workRequest.steps,
    width,
    height,
    samples: workRequest.variations, // should usually be constrained to 1 by earlier logic
    seed: workRequest.seed
  }
  return requestBody
}

const submitJson = async (json: apiText2ImgRequest): Promise<apiText2ImgResponse> => {
  const response = await fetch(env.SD_API_TXT2IMG_URL, {
    method: 'POST',
    body: JSON.stringify(json),
    headers: { 'content-type': 'application/json' },
  });
  const data: apiText2ImgResponse = await response.json()
  return data
};

