export default class MeasureType {
  private value: "WATER" | "GAS";

  constructor(measure_type: "WATER" | "GAS") {
    if (measure_type !== "WATER" && measure_type !== "GAS") throw new Error("Invalid measure type");
    this.value = measure_type;
  }

  getValue() {
    return this.value;
  }
}