import { ExpressAdapter } from "./infra/http/http-server";
import MeasurementRepositoryPrisma from "./infra/repository/measurement-repository-prisma";
import PrismaORM from "./infra/orm/prisma-orm";
import CreateMeasurement from "./application/usecase/create-measurement";
import LargeLanguageModelGatewayGemini from "./infra/gateway/llm-gateway-gemini";
import MeasurementController from "./infra/controller/measurement-controller";
import ConfirmMeasurement from "./application/usecase/confirm-measurement";
import ListMeasurements from "./application/usecase/list-customer-measurements";

(async () => {
  const prismaORM = new PrismaORM();
  const measurementRepository = new MeasurementRepositoryPrisma(prismaORM)
  const llmGateway = new LargeLanguageModelGatewayGemini();
  const createMeasurement = new CreateMeasurement(measurementRepository, llmGateway);
  const confirmMeasurement = new ConfirmMeasurement(measurementRepository);
  const listMeasurements = new ListMeasurements(measurementRepository);
  const httpServer = new ExpressAdapter();
  new MeasurementController(httpServer, createMeasurement, confirmMeasurement, listMeasurements);
  httpServer.listen(3000);
})();

