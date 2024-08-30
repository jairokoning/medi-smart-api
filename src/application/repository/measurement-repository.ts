import Measurement from "../../domain/entity/measurement";

export default interface MeasurementRepository {
  getMeasurementByCustomerAndDateRangeAndType(customer_code: string, start: Date, end: Date, type: "WATER" | "GAS"): Promise<Measurement | undefined>;
  saveMeasurement(measurement: Measurement): Promise<void>;
  getMeasurementByUuid(measure_uuid: string): Promise<Measurement | undefined>;
  confirmMeasurement(measurement: Measurement): Promise<void>;
  listCustomerMeasurements(customer_code: string, measure_type?: "WATER" | "GAS"): Promise<ListMeasures | undefined>;
}

type Measures = {
  measure_uuid: string;
  measure_datetime: Date;
  measure_type: "WATER" | "GAS";
  has_confirmed: boolean;
  image_url: string;
}

export type ListMeasures = {
  customer_code: string;
  measures: Measures[];
}