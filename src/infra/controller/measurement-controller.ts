import ConfirmMeasurement from "../../application/usecase/confirm-measurement";
import CreateMeasurement from "../../application/usecase/create-measurement";
import HttpServer from "../http/http-server";

export default class MeasurementController {
  constructor(
    readonly httpServer: HttpServer,
    readonly createMeasurement: CreateMeasurement,
    readonly confirmMeasurement: ConfirmMeasurement
  ) {
    httpServer.register("post", "/upload", async (params: any, body: any) => {
      const response = await createMeasurement.execute(body);
      return response;
    });

    httpServer.register("patch", "/confirm", async (params: any, body: any) => {
      const response = await confirmMeasurement.execute(body);
      return response;
    });
  }
}