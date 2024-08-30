-- CreateEnum
CREATE TYPE "MeasureTypeEnum" AS ENUM ('WATER', 'GAS');

-- CreateTable
CREATE TABLE "measurement" (
    "measure_uuid" TEXT NOT NULL,
    "customer_code" TEXT NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" "MeasureTypeEnum" NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL,
    "measure_value" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "measurement_pkey" PRIMARY KEY ("measure_uuid")
);
