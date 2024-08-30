import CustomerCode from "../vo/customer-code";
import ImageUrl from "../vo/image-url";
import MeasureDatetime from "../vo/measure-datetime";
import MeasureType from "../vo/measure-type";
import MeasureValue from "../vo/measure-value";

export default class Measurement {
  private customer_code: CustomerCode;
  private measure_datetime: MeasureDatetime;
  private measure_type: MeasureType;
  private measure_value: MeasureValue;
  private image_url: ImageUrl;

  constructor(
    readonly measure_uuid: string,
    customer_code: string,
    measure_datetime: Date,
    measure_type: "WATER" | "GAS",
    readonly has_confirmed: boolean,
    measure_value: number,
    image_url: string,
  ) {
    this.customer_code = new CustomerCode(customer_code);
    this.measure_datetime = new MeasureDatetime(measure_datetime);
    this.measure_type = new MeasureType(measure_type);
    this.measure_value = new MeasureValue(measure_value);
    this.image_url = new ImageUrl(image_url);
  }

  static create(customer_code: string, measure_datetime: Date, measure_type: "WATER" | "GAS", measure_value: number, image_url: string) {
    const measure_uuid = crypto.randomUUID();
    const confirmed = false;
    return new Measurement(measure_uuid, customer_code, measure_datetime, measure_type, confirmed, measure_value, image_url);
  }

  getCustomerCode() {
    return this.customer_code;
  }

  getMeasureDatetime() {
    return this.measure_datetime;
  }

  getMeasureType() {
    return this.measure_type;
  }

  getMeasureValue() {
    return this.measure_value;
  }

  getImageUrl() {
    return this.image_url;
  }

  confirm() {
    Measurement.setConfirmed(this);
  }

  static setConfirmed(measurement: Measurement) {
    (measurement as any).has_confirmed = true;
  }

  confirmMeasurementValue(measure_value: number) {
    this.measure_value = new MeasureValue(measure_value);
  }
}