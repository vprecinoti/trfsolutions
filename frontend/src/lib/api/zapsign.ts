import { api } from "../api";

interface SendContractDto {
  leadId: string;
  signerName: string;
  signerEmail: string;
  signerPhone?: string;
  pdfBase64: string;
  documentName?: string;
}

interface SendContractResponse {
  success: boolean;
  message: string;
  data: {
    documentId: string;
    status: string;
    signerEmail: string;
    signUrl: string;
  };
}

/**
 * Envia contrato para assinatura via ZapSign
 */
export async function sendContractToZapSign(dto: SendContractDto): Promise<SendContractResponse> {
  const response = await api.post<SendContractResponse>("/zapsign/send", dto);
  return response.data;
}

/**
 * Busca status de um documento no ZapSign
 */
export async function getDocumentStatus(token: string): Promise<any> {
  const response = await api.get(`/zapsign/status/${token}`);
  return response.data;
}
