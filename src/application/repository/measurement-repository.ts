import Measurement from "../../domain/entity/measurement";

export default interface MeasurementRepository {
  getMeasurementByCustomerAndDateRangeAndType(customer_code: string, start: Date, end: Date, type: "WATER" | "GAS"): Promise<Measurement | undefined>;
  saveMeasurement(measurement: Measurement): Promise<void>;
  getMeasurementByUuid(measure_uuid: string): Promise<Measurement | undefined>;
  confirmMeasurement(measurement: Measurement): Promise<void>;
}