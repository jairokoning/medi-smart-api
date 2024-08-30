import MeasurementRepository from "../../application/repository/measurement-repository";
import Measurement from "../../domain/entity/measurement";
import PrismaORM from "../orm/prisma-orm";

export default class MeasurementRepositoryPrisma implements MeasurementRepository {
  constructor(readonly prisma: PrismaORM) {}

  async saveMeasurement(measurement: Measurement): Promise<void> {
    await this.prisma.measurement.create({
      data: {
        measure_uuid: measurement.measure_uuid,
        customer_code: measurement.getCustomerCode().getValue(),
        measure_datetime: measurement.getMeasureDatetime().getValue(),
        measure_type: measurement.getMeasureType().getValue(),
        has_confirmed: measurement.has_confirmed,
        measure_value: measurement.getMeasureValue().getValue(),
        image_url: measurement.getImageUrl().getValue(),
      }
    });
  }

  async getMeasurementByCustomerAndDateRangeAndType(customer_code: string, start: Date, end: Date, type: "WATER" | "GAS"): Promise<Measurement | undefined> {
    const measurementData = await this.prisma.measurement.findFirst({
      where: {
        customer_code,
        measure_datetime: {
          gte: start,
          lte: end
        },
        measure_type: type
      }
    })
    if (!measurementData) return;
    return new Measurement(measurementData.measure_uuid, measurementData.customer_code, measurementData.measure_datetime, measurementData.measure_type, measurementData.has_confirmed, measurementData.measure_value, measurementData.image_url);
  }
}