import ConfirmMeasurement from "../../application/usecase/confirm-measurement";
import CreateMeasurement from "../../application/usecase/create-measurement";
import ListMeasurements from "../../application/usecase/list-customer-measurements";
import HttpServer from "../http/http-server";

export default class MeasurementController {
  constructor(
    readonly httpServer: HttpServer,
    readonly createMeasurement: CreateMeasurement,
    readonly confirmMeasurement: ConfirmMeasurement,
    readonly listMeasurements: ListMeasurements
  ) {
    httpServer.register("post", "/upload", async (params: any, query: any, body: any) => {
      console.log(params)
      console.log(body)
      const response = await createMeasurement.execute(body);
      return response;
    });

    httpServer.register("patch", "/confirm", async (params: any, query: any, body: any) => {
      const response = await confirmMeasurement.execute(body);
      return response;
    });

    httpServer.register("get", "/:{customer_code}/list", async (params: any, query: any, body: any) => {
      console.log(params)
      //console.log(query)
      console.log(body)
      const response = await listMeasurements.execute({ customer_code: params.customer_code, measure_type: query.measure_type });
      return response;
    });
  }
}