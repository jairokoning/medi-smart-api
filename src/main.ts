import { ExpressAdapter } from "./infra/http/http-server";
import MeasurementRepositoryPrisma from "./infra/repository/measurement-repository-prisma";
import PrismaORM from "./infra/orm/prisma-orm";
import CreateMeasurement from "./application/usecase/create-measurement";
import LargeLanguageModelGatewayGemini from "./infra/gateway/llm-gateway-gemini";
import MeasurementController from "./infra/controller/measurement-controller";
import LargeLanguageModelGateway, { LLMError } from "./application/gateway/llm-gateway";

(async () => {
  const prismaORM = new PrismaORM();
  const measurementRepository = new MeasurementRepositoryPrisma(prismaORM)

  const llmGateway = new LargeLanguageModelGatewayGemini();

  const llmGatewayFake: LargeLanguageModelGateway = {
    uploadImage: async function (image: string): Promise<{ image_url: string; measure_value: number; status: string; error?: LLMError }> {
      if (image.length < 50) {
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


  const createMeasurement = new CreateMeasurement(measurementRepository, llmGateway);
  const httpServer = new ExpressAdapter();
  //Registry.getInstance().provide("httpServer", httpServer);
  //Registry.getInstance().provide("createMeasurement", createMeasurement);
  new MeasurementController(httpServer, createMeasurement);
  httpServer.listen(3000);
})();

