/**
 * Template base para todos os emails da TRF Solutions.
 * Recebe o conteúdo interno e envolve com header/footer padrão.
 */
export function baseTemplate(conteudo: string): string {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1a; color: #ffffff; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1a2235 0%, #0a0f1a 100%); padding: 40px 32px; text-align: center;">
        <img src="https://trfsolutions.com.br/trf-logo.png" alt="TRF Solutions" style="max-width: 180px; height: auto; margin-bottom: 12px;" />
        <p style="color: #94a3b8; margin: 0; font-size: 14px;">Consultoria Financeira</p>
      </div>
      <div style="padding: 32px;">
        ${conteudo}
      </div>
      <div style="padding: 24px 32px; border-top: 1px solid #1a2235; text-align: center;">
        <p style="color: #64748b; margin: 0; font-size: 12px;">
          TRF Solutions - Consultoria Financeira<br/>
          Este é um email automático, por favor não responda.
        </p>
      </div>
    </div>
  `;
}
