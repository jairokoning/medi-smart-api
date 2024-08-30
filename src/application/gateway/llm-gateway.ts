export default interface LargeLanguageModelGateway {
  uploadImage(image: string): Promise<{ image_url: string, measure_value: number, status: string, error?: LLMError }>
}

export type LLMError = {
  code: number,
  message: string,
}