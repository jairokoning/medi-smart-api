import LargeLanguageModelGateway, { LLMError } from "../src/application/gateway/llm-gateway";
import MeasurementRepository from "../src/application/repository/measurement-repository";
import CreateMeasurement from "../src/application/usecase/create-measurement";
import Measurement from "../src/domain/entity/measurement";


let createMeasurement: CreateMeasurement;
let measurementRepository: MeasurementRepository;

type MeasurementData = {
  measure_uuid: string;
  customer_code: string;
  measure_datetime: Date;
  measure_type: "WATER" | "GAS";
  has_confirmed: boolean;
  measure_value: number;
  image_url: string;
}

describe("CreateMeasurement - Integration Test", () => {
  beforeEach(() => {
    const measurementsData: MeasurementData[] = []
    measurementRepository = {
      getMeasurementByCustomerAndDateRangeAndType: async function (customer_code: string, start: Date, end: Date, type: "WATER" | "GAS"): Promise<Measurement | undefined> {
        const measureData = measurementsData.find((measurement) => measurement.customer_code === customer_code && measurement.measure_datetime >= start && measurement.measure_datetime <= end && measurement.measure_type === type);
        if (!measureData) return;
        return new Measurement(measureData.measure_uuid, measureData.customer_code, measureData.measure_datetime, measureData.measure_type, measureData.has_confirmed, measureData.measure_value, measureData.image_url);
      },

      saveMeasurement: async function (measurement: Measurement): Promise<void> {
        measurementsData.push(
          {
            measure_uuid: measurement.measure_uuid,
            customer_code: measurement.getCustomerCode().getValue(),
            measure_datetime: measurement.getMeasureDatetime().getValue(),
            measure_type: measurement.getMeasureType().getValue(),
            has_confirmed: measurement.has_confirmed,
            measure_value: measurement.getMeasureValue().getValue(),
            image_url: measurement.getImageUrl().getValue(),
          }
        );
      }
    }
    const llmGateway: LargeLanguageModelGateway = {
      uploadImage: async function (image: string): Promise<{ image_url: string; measure_value: number; status: string; error?: LLMError }> {
        if (image.length > 100 || image.length < 50) {
          return {
            image_url: "",
            measure_value: 0,
            status: "FAILED",
            error: {
              code: 123,
              message: "Failed to process file."
            }
          }
        }
        return {
          image_url: "https://image_url.com",
          measure_value: 7091216,
          status: "ACTIVE",
        }
      }
    };
    createMeasurement = new CreateMeasurement(measurementRepository, llmGateway);
  })

  test("should create a water measurement", async () => {
    const input = {
      "image": "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      "customer_code": "1",
      "measure_datetime": new Date("2024-08-28 09:00:00"),
      "measure_type": "WATER" as "WATER" | "GAS"
    };
    const output = await createMeasurement.execute(input);
    expect(output.image_url).toBeDefined();
    expect(output.measure_value).toBeDefined();
    expect(output.measure_uuid).toBeDefined();
  })

  test("should throw error if invalid data", async () => {
    const input = {
      "image": "data:image/abc;base64,iVBORw0KGgo   .... AAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      "customer_code": "",
      "measure_datetime": new Date("2024-08-28 09:00:00"),
      "measure_type": "WATER" as "WATER" | "GAS"
    };
    expect(
      () => createMeasurement.execute(input)
    ).rejects.toThrow();
  })

  test("should throw error if measurement already exists for month and type", async () => {
    const measurement = Measurement.create("1", new Date("2024-08-02 10:30:00"), "GAS", 7091216, "https://image_url.com");
    await measurementRepository.saveMeasurement(measurement);
    const input = {
      "image": "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
      "customer_code": "1",
      "measure_datetime": new Date("2024-08-28 09:00:00"),
      "measure_type": "GAS" as "WATER" | "GAS"
    };
    expect(
      () => createMeasurement.execute(input)
    ).rejects.toThrow(new Error("Measurement already exists for this month and type"));
  })

  test("should throw error if LLM failed to process image", async () => {
    const input = {
      "image": "data:image/jpeg;base64,iVBORw0K=",
      "customer_code": "1",
      "measure_datetime": new Date("2024-08-28 09:00:00"),
      "measure_type": "GAS" as "WATER" | "GAS"
    };
    expect(
      () => createMeasurement.execute(input)
    ).rejects.toThrow();
  })
})