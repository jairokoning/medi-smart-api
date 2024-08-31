export default class MeasureValue {
  private value: number;

  constructor(measure_value: number) {
    if (measure_value < 0) throw new Error("Valor inválido");
    this.value = measure_value;
  }

  getValue() {
    return this.value;
  }
}