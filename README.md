<<<<<<< HEAD
# samu
=======
# SAMU Mauritanie - Portail Web

Application web du Service d'Aide Médicale Urgente de Mauritanie.

## Configuration Firebase

1. Créez un projet Firebase sur [Firebase Console](https://console.firebase.google.com/)
2. Activez l'authentification par email/mot de passe dans Firebase Authentication
3. Créez une base de données Firestore
4. Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAjQtaFj2qM15zX1dqq_wb1XaQzWle4l_Q
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=samu-dd1de.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=samu-dd1de
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=samu-dd1de.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=511030113021
NEXT_PUBLIC_FIREBASE_APP_ID=1:511030113021:web:84fb99334916015c914494

```

## Installation

```bash
npm install
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## Fonctionnalités

- Authentification utilisateur (inscription/connexion)
- Tableau de bord protégé
- Interface adaptée aux couleurs de la Mauritanie
- Design responsive

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
>>>>>>> 5d6d5d4 (Premier commit du projet)
