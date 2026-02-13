/**
 * Template base para todos os emails da TRF Solutions.
 * Recebe o conteúdo interno e envolve com header/footer padrão.
 */
export function baseTemplate(conteudo: string): string {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1a; color: #ffffff; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1a2235 0%, #0a0f1a 100%); padding: 40px 32px; text-align: center;">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAG1BMVEVMaXH7+/v6+vr9/f37+/v8/Pz9/f38/Pz+/v4PKMMxAAAACHRSTlMAAwGGIuKtYxy6T5YAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAJQSURBVHic7drrbuMgEAbQAWO77//EK7fdJm68ucnSiuGcSFX+zlcgMBABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCoymn+dyW8oUaZ7lm/Ppuvv/eUqNGbGm3+OMncRg+gDB7AEh0ug/XEANbBA5jb4AFMPdYf5wXQ5RIY5wXQ5wSI0wLotf44KYCl1/rjlACWtfRaf9Qoy851HPPyhGltNdKcBEtMb/yw1b7LL7sj/a8ARusDlLdGQCJFAJMRcGEKxPcasFvy6qHIoZgC0+0UqKU9VvOOgBLtY36oz8PwkwGsHw8JIAYfAVOSTWN5N4Bu+wEnBdDllcCJAXTbEDsrgC6vRM4LYM5Tf7wTQJ7xH+8EMHfcEH05gJsm6bS20ntH8OkA5qkdVVpLih3g4wCm7flHvWoK/P0SqZR/nQbbVnyyYl8YAdtCP0D1cRxAjfb1Q5fuEuD5ltjW8ste+r0APuuv0dZpWXp8CndGU7REW1J1Pl4MYFsIvzdDSZp/rwVwtRteIrVyGMC2E/jZ+8d4AdQol2cTI06Bcn0cHDGAGsvQAdTrGTBiAGX3kCz9r8B6FEDGBvixfbFHAWS5AvqH/Xw/CiBTB/RIuV7xDwJIvgbGvtqDABJdATwxBG4DWLIPgNi9nr4NIPsKEPt6bwLIPwH2Z//fAYxRf1y2fvsAUt0B3leiTPOvAOYp1R3gA6VEW5f5chZY1jZIW/jb54XnT8WfXwa5GflRd//wZFegT7q8gB6xegAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiPf8AUJDQlJUE3/dAAAAAElFTkSuQmCC" alt="TRF Solutions" style="max-width: 120px; height: auto; margin-bottom: 12px;" />
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
