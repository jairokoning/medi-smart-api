import CustomerCode from "../../domain/vo/customer-code";
import MeasureType from "../../domain/vo/measure-type";
import MeasurementRepository, { ListMeasures } from "../repository/measurement-repository";

export default class ListMeasurements {
  constructor(private measurementRepository: MeasurementRepository) {}

  async execute(input: Input): Promise<ListMeasures | undefined> {
    const customer_code = new CustomerCode(input.customer_code).getValue();
    let measure_type: "WATER" | "GAS" | undefined
    if (input.measure_type) {
      measure_type = new MeasureType(input.measure_type).getValue()
    }
    const output = await this.measurementRepository.listCustomerMeasurements(customer_code, measure_type);
    if (!output) throw new Error("Nenhuma leitura encontrada");
    return output;
  }
}

type Input = {
  customer_code: string,
  measure_type?: "WATER" | "GAS",
}
