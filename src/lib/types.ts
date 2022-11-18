export interface PricingOption {
  name: string;
  heading: string,
  note: string,
  link?: string,
  selectable: boolean,
  selected: boolean,
  value: number,
  valueText?: string,
}

export interface workRequest {
  imagePrompt: string,
  imagePromptNegative: string,
  creativity: number,
  scale: number,
  steps: number,
  aspect: string,
  size: string,
  variations: number,
  varyBy?: string,
  varyRandomly?: boolean,
  varianceDir?: string,
  varianceDirAmt?: number,
  varianceSettings?: string[],
  seed?: number,
}

export interface apiText2ImgRequest {
  key: string,
  prompt: string,
  negative_prompt?: string,
  guidance_scale: number,
  num_inference_steps: number,
  width: number,
  height: number,
  samples: number,
  seed?: number,
  webhook?: string,
  track_id?: string,
}

export interface apiText2ImgResponse {
  status: 'success' | 'error' | 'processing',
  tip?: string,
  eta?: number,
  message?: string,
  messege?: string, // typo in api response for processing message
  fetch_result?: string,
  id?: number,
  generationTime?: number,
  output?: string[] | string,
  meta?: {
    W: number,
    H: number,
    prompt: string,
    negative_prompt: string,
    guidance_scale: number,
    steps: number,
    seed: number,
    n_samples: number,
    file_prefix: string,
    enable_attention_slicing: string,
    safety_checker: string,
    model: string,
    vae: string,
    revision: string,
    outdir: string,
  }
}
