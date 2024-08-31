import MeasurementRepository from "../repository/measurement-repository";

export default class ConfirmMeasurement {
  constructor(private measurementRepository: MeasurementRepository) {}

  async execute(input: Input): Promise<Output> {
    const measurement = await this.measurementRepository.getMeasurementByUuid(input.measure_uuid);
    if (!measurement) throw new Error("Leitura não encontrada");
    if (measurement.has_confirmed) throw new Error("Leitura já confirmada");
    measurement.confirm();
    measurement.confirmMeasurementValue(input.confirmed_value);
    await this.measurementRepository.confirmMeasurement(measurement);
    return { success: true };
  }
}

type Input = {
  measure_uuid: string,
  confirmed_value: number
}

type Output = {
  success: boolean,
}