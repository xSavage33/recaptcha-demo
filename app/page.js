'use client';

import { useEffect, useState } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function Home() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Carga el script de reCAPTCHA v3 una sola vez.
  useEffect(() => {
    if (!SITE_KEY) {
      setError('Falta NEXT_PUBLIC_RECAPTCHA_SITE_KEY en el entorno.');
      return;
    }
    if (document.getElementById('recaptcha-v3')) {
      setReady(true);
      return;
    }
    const s = document.createElement('script');
    s.id = 'recaptcha-v3';
    s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    s.onload = () => setReady(true);
    s.onerror = () => setError('No se pudo cargar el script de Google.');
    document.head.appendChild(s);
  }, []);

  async function run() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      // 1) Genera el token en el navegador para la acción "demo".
      const token = await new Promise((resolve, reject) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(SITE_KEY, { action: 'demo' })
            .then(resolve)
            .catch(reject);
        });
      });

      // 2) Envía el token a tu servidor, que lo verifica con la clave secreta.
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action: 'demo' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en la verificación');
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ width: '100%', maxWidth: 440, padding: 24 }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>Demo reCAPTCHA v3</h1>
      <p style={{ color: '#9aa0aa', marginTop: 0, fontSize: 14 }}>
        Pulsa el botón para generar un token y ver el score que devuelve Google.
      </p>

      <button
        onClick={run}
        disabled={!ready || loading}
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: 15,
          borderRadius: 10,
          border: 'none',
          cursor: ready && !loading ? 'pointer' : 'not-allowed',
          background: ready && !loading ? '#4f7cff' : '#2a2d36',
          color: '#fff',
        }}
      >
        {loading ? 'Comprobando…' : ready ? 'Comprobar score' : 'Cargando…'}
      </button>

      {result && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 10,
            background: '#14161d',
            border: '1px solid #262a33',
          }}
        >
          <div style={{ fontSize: 13, color: '#9aa0aa' }}>Resultado</div>
          <div style={{ fontSize: 34, fontWeight: 700, margin: '4px 0' }}>
            {result.score}
          </div>
          <div style={{ fontSize: 13, color: '#9aa0aa' }}>
            success: {String(result.success)} · action: {result.action || '—'}
          </div>
        </div>
      )}

      {error && (
        <p style={{ marginTop: 16, color: '#ff6b6b', fontSize: 14 }}>{error}</p>
      )}
    </main>
  );
}
