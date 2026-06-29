-- CreateTable: Backups (snapshots) automáticos do formulário
CREATE TABLE "formulario_snapshots" (
    "id" TEXT NOT NULL,
    "formulario_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "step_atual" INTEGER NOT NULL DEFAULT 0,
    "progresso" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'auto-save',
    "cliente_nome" TEXT,
    "cliente_email" TEXT,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "formulario_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "formulario_snapshots_formulario_id_idx" ON "formulario_snapshots"("formulario_id");
CREATE INDEX "formulario_snapshots_user_id_idx" ON "formulario_snapshots"("user_id");
CREATE INDEX "formulario_snapshots_created_at_idx" ON "formulario_snapshots"("created_at");

-- CreateTable: Log de erros do frontend (com payload para recuperação)
CREATE TABLE "error_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "formulario_id" TEXT,
    "error_type" TEXT NOT NULL,
    "error_message" TEXT NOT NULL,
    "error_stack" TEXT,
    "payload" JSONB,
    "url" TEXT,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "error_logs_user_id_idx" ON "error_logs"("user_id");
CREATE INDEX "error_logs_formulario_id_idx" ON "error_logs"("formulario_id");
CREATE INDEX "error_logs_error_type_idx" ON "error_logs"("error_type");
CREATE INDEX "error_logs_created_at_idx" ON "error_logs"("created_at");
CREATE INDEX "error_logs_resolved_idx" ON "error_logs"("resolved");
