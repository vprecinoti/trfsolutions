"use client";

// Layout exclusivo para o formulário - SEM sidebar e header
export default function FormularioNovoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: `
          radial-gradient(circle at 10% 10%, rgba(58, 141, 255, 0.12), transparent 40%),
          radial-gradient(circle at 90% 90%, rgba(58, 141, 255, 0.08), transparent 40%),
          #06070a
        `,
        backgroundAttachment: 'fixed'
      }}
    >
      {children}
    </div>
  );
}
