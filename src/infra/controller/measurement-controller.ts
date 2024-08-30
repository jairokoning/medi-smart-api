import CreateMeasurement from "../../application/usecase/create-measurement";
import HttpServer from "../http/http-server";

export default class MeasurementController {
  constructor(readonly httpServer: HttpServer, readonly createMeasurement: CreateMeasurement) {
    httpServer.register("post", "/upload", async (params: any, body: any) => {
      const response = await createMeasurement.execute(body);
      return response;
    });
  }
}