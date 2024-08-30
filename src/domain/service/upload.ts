import CustomerCode from "../vo/customer-code";
import Image from "../vo/image";
import MeasureDatetime from "../vo/measure-datetime";
import MeasureType from "../vo/measure-type";

export default class Upload {
  private image: Image;
  private customer_code: CustomerCode;
  private measure_datetime: MeasureDatetime;
  private measure_type: MeasureType;

  constructor(
    image: string,
    customer_code: string,
    measure_datetime: Date,
    measure_type: "WATER" | "GAS",
  ) {
    this.image = new Image(image);
    this.customer_code = new CustomerCode(customer_code);
    this.measure_datetime = new MeasureDatetime(measure_datetime);
    this.measure_type = new MeasureType(measure_type);
  }

  getImage() {
    return this.image.getValue();
  }

  getCustomerCode() {
    return this.customer_code.getValue();
  }

  getMeasureDateTime() {
    return this.measure_datetime.getValue();
  }

  getMeasureType() {
    return this.measure_type.getValue();
  }

  getMonthRange(): { start: Date, end: Date } {
    const year = new Date(this.getMeasureDateTime()).getFullYear();
    const month = new Date(this.getMeasureDateTime()).getMonth();
    const start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
    return { start, end };
  }
}