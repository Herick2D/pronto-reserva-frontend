import './globals.css';
import React from 'react';

export const metadata = {
    title: 'Pronto Reserva',
    description: 'Sistema de reservas para o quer você quiser',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className='dark'>
            <body>
              {children}
            </body>
        </html>
    );
}