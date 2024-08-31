export default class Image {
  private value: string;
  BASE64_PATTERN = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/;

  constructor(image: string) {
    if (!this.BASE64_PATTERN.test(image)) throw new Error("Imagem não é Base64 válida");
    this.value = image;
  }

  getValue() {
    return this.value;
  }
}