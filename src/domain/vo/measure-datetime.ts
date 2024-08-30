export default class MeasureDatetime {
  private value: Date;

  constructor(measure_datetime: Date) {
    if (!this.isValidDateTime(measure_datetime)) throw new Error("Invalid measure datetime");
    this.value = measure_datetime;
  }

  getValue() {
    return new Date(this.value);
  }

  isValidDateTime(measure_datetime: Date): boolean {
    const dateTime = new Date(measure_datetime);
    return !isNaN(dateTime.getTime());
  }
}