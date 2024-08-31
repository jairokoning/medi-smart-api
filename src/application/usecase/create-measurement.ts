import Measurement from "../../domain/entity/measurement";
import Upload from "../../domain/service/upload";
import ImageUrl from "../../domain/vo/image-url";
import MeasureValue from "../../domain/vo/measure-value";
import LargeLanguageModelGateway from "../gateway/llm-gateway";
import MeasurementRepository from "../repository/measurement-repository";

export default class CreateMeasurement {
  constructor(private measurementRepository: MeasurementRepository, private llmGateway: LargeLanguageModelGateway) {}

  async execute(input: Input): Promise<Output> {
    const upload = new Upload(input.image, input.customer_code, input.measure_datetime, input.measure_type);
    const { start, end } = upload.getMonthRange();
    const existingMeasureData = await this.measurementRepository
      .getMeasurementByCustomerAndDateRangeAndType(upload.getCustomerCode(), start, end, upload.getMeasureType());
    if (existingMeasureData) throw new Error("Leitura do mês já realizada");
    const llmResponse = await this.llmGateway.uploadImage(upload.getImage());
    if (llmResponse.status === "FAILED") {
      if (llmResponse.error?.message) throw new Error(llmResponse.error.message);
      throw new Error("LLM failed to process image");
    }
    const measurement = Measurement.create(upload.getCustomerCode(), upload.getMeasureDateTime(), upload.getMeasureType(), llmResponse.measure_value, llmResponse.image_url);
    await this.measurementRepository.saveMeasurement(measurement);
    return {
      image_url: measurement.getImageUrl().getValue(),
      measure_value: measurement.getMeasureValue().getValue(),
      measure_uuid: measurement.measure_uuid,
    };
  }
}

type Input = {
  image: string,
  customer_code: string,
  measure_datetime: Date,
  measure_type: "WATER" | "GAS",
}

type Output = {
  image_url: string,
  measure_value: number,
  measure_uuid: string,
}