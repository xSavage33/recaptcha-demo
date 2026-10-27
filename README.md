# Demo reCAPTCHA v3 (Next.js + Vercel)

Página que genera un token de reCAPTCHA v3 en el navegador y muestra el **score**
que devuelve Google tras verificarlo en el servidor.

## 1. Consigue las claves (gratis)

1. Entra en https://www.google.com/recaptcha/admin
2. Crea un sitio de tipo **reCAPTCHA v3**.
3. En *Dominios* añade `localhost` (para pruebas) y tu dominio de Vercel
   (p. ej. `tu-proyecto.vercel.app`).
4. Copia la **Clave del sitio** y la **Clave secreta**.

## 2. Configura el entorno

```bash
cp .env.local.example .env.local
# edita .env.local y pega tus dos claves
```

## 3. Ejecuta en local

```bash
npm install
npm run dev
# abre http://localhost:3000
```

## 4. Despliega en Vercel

1. Sube el proyecto a un repositorio de GitHub (el `.gitignore` ya excluye
   `node_modules`, `.next` y `.env.local`).
2. En Vercel, **Add New → Project** e importa el repo.
3. En *Settings → Environment Variables* añade:
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - `RECAPTCHA_SECRET_KEY`
4. Deploy.

## Notas

- La clave secreta solo se usa en `app/api/verify/route.js` (servidor). Nunca
  la expongas con el prefijo `NEXT_PUBLIC_`.
- El umbral (`THRESHOLD = 0.5`) se ajusta en la API route según cuánto quieras
  filtrar. En v3 un humano normal suele dar 0.7–0.9.
- Verifica siempre en el servidor `success`, la `action` y el `score`.
