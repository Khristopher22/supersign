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
## Variaveis de ambiente 
Essas são as variaveis de ambiente a serem utilizadas na aplicação. A variavel `root_path` é o diretorio onde ficara salvo os arquivos dos usuarios.
```
DATABASE_URL="mongodb+srv://khristopheroficial:desafioSuperSign@supersign.pftif4q.mongodb.net/supersign?retryWrites=true&w=majority&appName=supersign"
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
HOST_URL=http://localhost:3000
NEXTAUTH_SECRET=projetosecreto123
GOOGLE_CLIENT_ID=<id do google cloud>
GOOGLE_CLIENT_SECRET=< secret do clientid google cloud >
ROOT_PATH="/app/supersign/"
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/DashboardClient.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
