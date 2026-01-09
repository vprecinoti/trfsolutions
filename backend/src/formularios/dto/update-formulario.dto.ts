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

