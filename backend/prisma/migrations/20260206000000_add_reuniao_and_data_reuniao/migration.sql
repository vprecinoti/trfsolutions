-- AlterTable: Add data_reuniao to leads
ALTER TABLE "leads" ADD COLUMN "data_reuniao" TIMESTAMP(3);

-- CreateEnum
CREATE TYPE "TipoReuniao" AS ENUM ('CONSULTORIA', 'ACOMPANHAMENTO', 'APRESENTACAO', 'OUTRO');

-- CreateEnum
CREATE TYPE "StatusReuniao" AS ENUM ('AGENDADA', 'CONFIRMADA', 'REALIZADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "reunioes" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "data_hora" TIMESTAMP(3) NOT NULL,
    "duracao" INTEGER NOT NULL DEFAULT 60,
    "tipo" "TipoReuniao" NOT NULL DEFAULT 'CONSULTORIA',
    "status" "StatusReuniao" NOT NULL DEFAULT 'AGENDADA',
    "lead_id" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reunioes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reunioes_user_id_idx" ON "reunioes"("user_id");

-- CreateIndex
CREATE INDEX "reunioes_lead_id_idx" ON "reunioes"("lead_id");

-- CreateIndex
CREATE INDEX "reunioes_data_hora_idx" ON "reunioes"("data_hora");

-- AddForeignKey
ALTER TABLE "reunioes" ADD CONSTRAINT "reunioes_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reunioes" ADD CONSTRAINT "reunioes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
