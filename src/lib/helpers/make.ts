//- SD API Notes

//- using 'k_lms' for sampler
//- using 'Real-ESRGAN' for upscaling
//- using 'gfpgan' for face restoration
//- () will increase the weight of the surrounded words
//- [] will do opposite and reduce the weight
//- a prompt in form "subject:4" will assign a weight of 4 to the subject (not sure if this is implemented in API)

//- example photo realistic prompt:
//- "ultra realistic SHOT (e.g. close up) portrait of ((SUBJECT)), ATTRIBUTES (e.g. blue eyes, shaved side haircut),
//-  hyper detail, cinematic lighting, Canon EOS R3, nikon, f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame, 8K",

import type { workRequest, apiText2ImgResponse } from '$lib/types'

export type AspectOption = 'square' | 'landscape' | 'portrait'
export type SizeOption = 'sm' | 'md' | 'lg' | 'xl'
export type VariationOption = 1 | 3 | 6 | 9
export type VaryByAmtOption = 'creativity' | 'effort'
export const IsVaryByAmt = (word: string): word is VaryByAmtOption => { return word === 'creativity' || word === 'effort' }
export type VaryByKeywordOption = 'type' | 'style' | 'color' | 'shot' | 'seed'
export const IsVaryByKeyword = (word: string): word is VaryByKeywordOption => { return word === 'type' || word === 'style' || word === 'color' || word === 'shot' || word === 'seed' }
export type varianceDir = 'add' | 'subtract' | 'add-subtract'

export const API_CONSTRAINTS = {
  MIN_STEPS: 1,
  MAX_STEPS: 50,
  MIN_SCALE: 1,
  MAX_SCALE: 20,
}

export const imageDimensions = {
  sm: {
    square: { width: 256, height: 256 },
    landscape: { width: 256, height: 176 },
    portrait: { width: 176, height: 256 }
  },
  md: {
    square: { width: 528, height: 528 },
    landscape: { width: 528, height: 384 },
    portrait: { width: 384, height: 528 }
  },
  lg: {
    square: { width: 768, height: 768 },
    landscape: { width: 768, height: 512 },
    portrait: { width: 512, height: 768 }
  },
  xl: {
    square: { width: 1024, height: 1024 },
    landscape: { width: 1024, height: 768 },
    portrait: { width: 768, height: 1024 }
  }
}

export const imageDefaults = {
  prompt: '',
  negative_prompt: '',
  cfg: 7.5,
  steps: 20,
  aspect: 'square' as AspectOption,
  size: 'md' as SizeOption,
  width: imageDimensions['md']['square'].width,
  height: imageDimensions['md']['square'].height,
  variations: 1 as VariationOption,
  varyBy: 'type' as VaryByKeywordOption | VaryByAmtOption,
  varyRandomly: true,
  varianceDir: 'add' as varianceDir,
  varianceDirAmt: 5,
  varianceSettings: []
}

export const promptIdeas = [
  'a young girl playing basketball',
  'a happy family traveling',
  'writing a book',
  'the endless ocean',
  'the power of love',
]

export const imageTypes = [
  {
    label: 'Photo',
    promptModifier: 'photo, ultra realistic, hyper detail, cinematic lighting, Canon EOS R3, nikon, f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame, 8K',
  },
  {
    label: 'Illustration',
    promptModifier: 'illustration of',
  },
  {
    label: 'Vector Art',
    promptModifier: 'vector art of',
  },
]

export const imageColors = [
  {
    label: 'Natural',
    promptModifier: 'natural color',
  },
  {
    label: 'Grayscale',
    promptModifier: 'grayscale',
  },
  {
    label: 'Vibrant',
    promptModifier: 'vibrant color',
  },
]

export const imageStyles = [
  {
    label: 'Realistic',
    promptModifier: 'realistic',
  },
  {
    label: 'Abstract',
    promptModifier: 'abstract',
  },
  {
    label: 'Cartoon',
    promptModifier: 'cartoon',
  },
]

export const imageShots = [
  {
    label: 'Close Up',
    promptModifier: 'close up',
  },
  {
    label: 'Medium',
    promptModifier: 'medium shot',
  },
  {
    label: 'Wide',
    promptModifier: 'wide shot',
  },
  {
    label: 'Extra Wide',
    promptModifier: 'extra wide shot',
  },
]

export const getCreativityPercent = (creativityValue: number) => {
  const percent = Math.round(creativityValue * 100 / API_CONSTRAINTS.MAX_SCALE)
  if (percent === 5) return 'Min'
    else if (percent === 100) return 'Max'
    else return percent + '%'
}

export const getStepsPercent = (stepsValue: number) => {
  const percent = Math.round(stepsValue * 100 / API_CONSTRAINTS.MAX_STEPS)
  if (percent === 2) return 'Min'
    else if (percent === 100) return 'Max'
    else return percent + '%'
}

export const checkImageGridHeight = (imageGrid: HTMLElement, workRequest: workRequest): boolean | undefined => {
  if (imageGrid) {
    // const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    const viewportHeight = window.innerHeight
    const imageGridWidth = imageGrid.getBoundingClientRect().width
    const maxImageWidth = workRequest.variations > 2 ? imageGridWidth / 3 : imageGridWidth
    const size = workRequest.size as keyof typeof imageDimensions
    const aspect = workRequest.aspect as keyof typeof imageDimensions[typeof size]
    const { width, height } = imageDimensions[size][aspect]
    const imageAspectRatio = width / height
    const imageHeight = maxImageWidth / imageAspectRatio
    const imageRows = Math.ceil(workRequest.variations / 3)
    const imageGridHeight = imageHeight * imageRows
    if (imageGridHeight > viewportHeight) return true
      else return false
  }
}

export const getWorkRequests = (workRequest: workRequest): workRequest[] => {
  const workRequests: workRequest[] = []
  if (workRequest.variations === 1) {
    workRequests.push(workRequest)
  }
  else {
    for (let i = 0; i < workRequest.variations; i++) {
      const newWorkRequest: workRequest = {
        imagePrompt: workRequest.imagePrompt,
        imagePromptNegative: workRequest.imagePromptNegative,
        creativity: workRequest.creativity,
        scale: workRequest.scale,
        steps: workRequest.steps,
        aspect: workRequest.aspect,
        size: workRequest.size,
        variations: 1,
      }

      // ? check first if varyBy is a keyword or amount?

      if (workRequest.varyRandomly) {
        // TODO: if varyBy = keyword; update prompts for item with one of options dictated by value
        // newWorkRequest.imagePrompt = workRequest.imagePrompt
        // newWorkRequest.imagePromptNegative = workRequest.imagePromptNegative
        
        // TODO: if varyBy = seed; apply random seed to item
        // newWorkRequest.seed = Math.floor(Math.random() * 10000000000)
      }
      if (!workRequest.varyRandomly) {
        // TODO: update prompts for item by varianceSettings declared value (if varianceSettings is empty, use random option dictated by varyBy value)
        // newWorkRequest.imagePrompt = workRequest.imagePrompt
        // newWorkRequest.imagePromptNegative = workRequest.imagePromptNegative
      }
      workRequests.push(newWorkRequest)
    }
  }
  return workRequests
}

export const apiCall = async (workRequest: workRequest): Promise<apiText2ImgResponse | { status: string, message: string }> => {
  // call local API
  const apiResponse = await fetch('/api/make', {
    method: 'POST',
    body: JSON.stringify(workRequest),
    headers: { 'content-type': 'application/json' },
  });
  const apiData: apiText2ImgResponse = await apiResponse.json();
  // handle errors
  if(!apiResponse.ok || apiData.status !== 'success') {
    return { status: 'error', message: apiData.message ?? 'Unable to process request.' }
  }
  // return data
  return apiData
}

export const fakeApiCall = (workRequest: workRequest): apiText2ImgResponse => {
  // create test images (should usually be constrained to 1 by earlier logic)
  const size = workRequest.size as keyof typeof imageDimensions
  const aspect = workRequest.aspect as keyof typeof imageDimensions[typeof size]
  const { width, height } = imageDimensions[size][aspect]
  const testImages = []
  for (let i = 0; i < workRequest.variations; i++) testImages.push(`https://picsum.photos/seed/${Math.floor(Math.random() * 999999).toString(16)}/${width}/${height}`)
  // create test response
  const testData = {
    status: 'success',
    generationTime: 2,
    id: 100000,
    output: testImages,
    meta: {
      W: width ?? imageDefaults.width,
      H: height ?? imageDefaults.height,
      prompt: workRequest.imagePrompt ?? imageDefaults.prompt,
      negative_prompt: workRequest.imagePromptNegative ?? imageDefaults.negative_prompt,
      guidance_scale: workRequest.scale ?? imageDefaults.cfg,
      steps: workRequest.steps ?? imageDefaults.steps,
      seed: Math.floor(Math.random() * 10000000000),
      n_samples: workRequest.variations ?? imageDefaults.variations,
      file_prefix: '1000000000_0',
      enable_attention_slicing: "true",
      safety_checker: "none",
      model: "testImages",
      vae: "testImages",
      revision: "testImages",
      outdir: "out",
    }
  }
  return testData
}
