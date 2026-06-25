import { IsOptional, IsString, IsArray, IsInt, IsObject, IsEnum, Min, Max } from 'class-validator';

export enum FormularioStatus {
  RASCUNHO = 'RASCUNHO',
  COMPLETO = 'COMPLETO',
  ABANDONADO = 'ABANDONADO',
}

export class UpdateFormularioDto {
  @IsOptional()
  @IsString()
  clienteNome?: string;

  @IsOptional()
  @IsString()
  clienteEmail?: string;

  @IsOptional()
  @IsString()
  clienteTelefone?: string;

  @IsOptional()
  @IsArray()
  objetivosSelecionados?: string[];

  @IsOptional()
  @IsObject()
  respostas?: Record<string, Record<number, string>>;

  @IsOptional()
  @IsInt()
  @Min(0)
  stepAtual?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progresso?: number;

  @IsOptional()
  @IsEnum(FormularioStatus)
  status?: FormularioStatus;
}

// Payload aceito pelo endpoint POST /formularios/:id/complete
// Inclui dados de contrato (opcional) e a pontuacao calculada no frontend.
export class CompleteFormularioDto {
  // Dados de contrato
  @IsOptional() @IsString() cpf?: string;
  @IsOptional() @IsString() rg?: string;
  @IsOptional() @IsString() endereco?: string;
  @IsOptional() @IsString() bairro?: string;
  @IsOptional() @IsString() cep?: string;
  @IsOptional() @IsString() cidade?: string;
  @IsOptional() @IsString() estado?: string;
  @IsOptional() @IsString() estadoCivil?: string;
  @IsOptional() @IsString() profissao?: string;
  @IsOptional() valorContrato?: number;
  @IsOptional() @IsString() formaPagamento?: string;

  // Pontuacao calculada no frontend e refletida no Lead
  @IsOptional() scoreFinal?: number;
  @IsOptional() @IsObject() pilarPontuacoes?: Record<string, unknown>;
}

