export const metadata = {
  title: 'Demo reCAPTCHA v3',
  description: 'Muestra el score que devuelve reCAPTCHA v3',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#0b0c10',
          color: '#e8e8e8',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </body>
    </html>
  );
}
