import { PrismaClient } from "@prisma/client";

export default class PrismaORM extends PrismaClient {
  constructor() {
    super()
  }
}