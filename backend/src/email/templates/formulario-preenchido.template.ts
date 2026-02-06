import { baseTemplate } from './base.template';

interface FormularioPreenchidoData {
  nomeCliente: string;
  nomeConsultor: string;
}

export function formularioPreenchidoTemplate(data: FormularioPreenchidoData): string {
  return baseTemplate(`
    <h2 style="color: #ffffff; margin: 0 0 16px 0; font-size: 22px;">Olá, ${data.nomeCliente}! ✅</h2>
    <p style="color: #cbd5e1; line-height: 1.6; margin: 0 0 16px 0;">
      Seu formulário de planejamento financeiro foi preenchido com sucesso!
    </p>
    <p style="color: #cbd5e1; line-height: 1.6; margin: 0 0 24px 0;">
      Nosso consultor <strong style="color: #ffffff;">${data.nomeConsultor}</strong> já está analisando suas informações e em breve entrará em contato com sua proposta personalizada.
    </p>
    <div style="background: #1a2235; border-radius: 12px; padding: 20px; border: 1px solid #10b98133; margin-bottom: 24px;">
      <p style="color: #10b981; margin: 0 0 12px 0; font-size: 15px; font-weight: 600;">✅ Formulário concluído</p>
      <p style="color: #cbd5e1; margin: 0; line-height: 1.6;">
        Todas as suas informações foram registradas com segurança. O próximo passo é a apresentação da sua proposta de consultoria.
      </p>
    </div>
    <div style="background: #1a2235; border-radius: 12px; padding: 20px; border: 1px solid #2a3245;">
      <p style="color: #94a3b8; margin: 0 0 8px 0; font-size: 13px;">O que acontece agora:</p>
      <ul style="color: #cbd5e1; margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>Análise do seu perfil financeiro</li>
        <li>Elaboração da proposta personalizada</li>
        <li>Reunião de apresentação dos resultados</li>
      </ul>
    </div>
  `);
}
