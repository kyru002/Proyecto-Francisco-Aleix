export const metadata = {
  title: 'Servicore - Sistema de Tickets',
  description: 'Sistema de gestion de tickets de soporte tecnico',
    generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}


import './globals.css'