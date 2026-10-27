// API route: verifica el token de reCAPTCHA v3 en el servidor.
// La clave secreta vive SOLO aquí, nunca llega al navegador.

export async function POST(req) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return Response.json(
      { error: 'Falta RECAPTCHA_SECRET_KEY en el servidor.' },
      { status: 500 }
    );
  }

  let token;
  let expectedAction;
  try {
    const body = await req.json();
    token = body.token;
    expectedAction = body.action;
  } catch {
    return Response.json({ error: 'JSON inválido.' }, { status: 400 });
  }

  if (!token) {
    return Response.json({ error: 'Falta el token.' }, { status: 400 });
  }

  // Google espera los datos como formulario (application/x-www-form-urlencoded).
  const params = new URLSearchParams({ secret, response: token });

  const googleRes = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    }
  );
  const data = await googleRes.json();

  // Comprobaciones recomendadas para v3:
  // 1) success === true
  // 2) la acción coincide con la que esperabas (evita reusar tokens de otra parte)
  // 3) el score supera tu umbral
  const THRESHOLD = 0.5;
  const actionOk = !expectedAction || data.action === expectedAction;
  const allowed = data.success === true && actionOk && data.score >= THRESHOLD;

  return Response.json({
    success: data.success === true,
    score: data.score ?? null,
    action: data.action ?? null,
    allowed,
    threshold: THRESHOLD,
    errorCodes: data['error-codes'] || [],
  });
}
