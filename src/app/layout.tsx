import './globals.css';
import React from 'react';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Pronto Reserva',
  description: 'Sistema de reservas para o que você quiser',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '8px',
              background: '#333',
              color: '#fff',
            },
            success: { duration: 3000 },
            error: { duration: 5000 },
          }}
        />
      </body>
    </html>
  );
}
