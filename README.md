# Idees per Inversions 2026

Lloc web per mostrar idees i propostes d'inversió amb un disseny atractiu tipus immobiliari.

## Característiques

- 🏠 Disseny atractiu tipus immobiliari
- 📊 Categories d'inversió amb acordions
- 💰 Detalls d'inversió amb pros/cons
- 🖼️ Galeries d'imatges per cada idea
- 🔐 Panell d'administració amb autenticació
- 🚫 No indexat per motors de cerca (ús intern)
- 🇨🇦 Tot el contingut en català

## Tecnologies

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

## Instal·lació

```bash
npm install
```

## Desenvolupament

```bash
npm run dev
```

Obre [http://localhost:3000](http://localhost:3000) al navegador.

## Accés Administrador

- URL: `/admin`
- Contrasenya per defecte: `admin2026`

Des del panell d'administració pots:
- Editar títols, descripcions i dades d'inversió
- Modificar avantatges i inconvenients
- Gestionar galeries d'imatges
- Afegir noves idees d'inversió

## Desplegament a Netlify

1. Connecta el repositori a Netlify
2. La configuració està al fitxer `netlify.toml`
3. Netlify detectarà automàticament Next.js i desplegarà

## Estructura del Projecte

```
├── app/
│   ├── page.tsx          # Pàgina principal amb acordions
│   ├── idea/[id]/        # Pàgines individuals d'idees
│   ├── admin/            # Panell d'administració
│   └── layout.tsx        # Layout principal
├── components/ui/        # Components shadcn/ui
├── data/
│   └── investments.ts    # Dades de les inversions
├── types/
│   └── investment.ts     # Tipus TypeScript
└── netlify.toml          # Configuració Netlify

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
