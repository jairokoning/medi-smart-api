export default class CustomerCode {
  private value: string;

  constructor(customer_code: string) {
    if (!customer_code.match(/^[a-zA-Z0-9-]+$/)) throw new Error("Código de cliente inválido");
    this.value = customer_code;
  }

  getValue() {
    return this.value;
  }
}