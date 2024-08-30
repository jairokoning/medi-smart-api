export default class ImageUrl {
  private value: string;

  constructor(image_url: string) {
    if (!image_url) throw new Error("Invalid image url");
    this.value = image_url;
  }

  getValue() {
    return this.value;
  }
}