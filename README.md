Este é um projeto Next.js iniciado com o comando npm run dev.

## Começando

Primeiro, inicie o servidor de desenvolvimento:

```bash
# Instale as dependências do projeto
npm install

# Gere os clientes do Prisma com base no schema
npx prisma generate

# Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```
# SuperSign – Variáveis de Ambiente

Este projeto utiliza variáveis de ambiente para configurar o acesso a serviços externos, ambiente de execução, autenticação e manipulação de arquivos.

## 📦 Variáveis usadas no `.env`

| Variável              | Descrição |
|-----------------------|-----------|
| `DATABASE_URL`        | URL de conexão com o banco de dados MongoDB. Deve conter o usuário, senha, cluster e nome do banco utilizados na instância. Exemplo: MongoDB Atlas. |
| `NODE_ENV`            | Define o ambiente de execução do Node.js. Utilize `development` em ambiente local e `production` em produção. |
| `NEXTAUTH_URL`        | URL base usada pelo NextAuth para gerar links de redirecionamento. Em produção, utilize a URL do seu domínio (ex: `https://supersign.vercel.app`). |
| `HOST_URL`            | URL pública da aplicação. Usada em funcionalidades que exigem apontamento externo, como webhooks ou geração de links acessíveis. Em ambiente local, pode ser `http://localhost:3000`. |
| `NEXTAUTH_SECRET`     | Chave secreta utilizada pelo NextAuth para criptografia de tokens e segurança de sessão. Deve ser longa e imprevisível. |
| `GOOGLE_CLIENT_ID`    | Identificador do aplicativo OAuth2 criado no Google Cloud. Utilizado para autenticação via Google. |
| `GOOGLE_CLIENT_SECRET`| Segredo associado ao `GOOGLE_CLIENT_ID`, também configurado no Google Cloud, necessário para concluir o fluxo de autenticação. |
| `ROOT_PATH`           | Caminho absoluto onde arquivos temporários (como PDFs enviados) serão manipulados pelo backend. Em produção (como no Docker ou Vercel), usar algo como `/tmp` ou outro diretório permitido. |

## Tecnologias utilizadas

```
O SuperSign foi desenvolvido com um conjunto moderno de tecnologias, voltado para performance, segurança e escalabilidade. Abaixo estão as principais ferramentas e bibliotecas utilizadas:

⚙️ Front-End e Back-End
Next.js – Framework React com suporte a rotas de API, SSR e App Router.

1-TypeScript – Superset do JavaScript que adiciona tipagem estática, aumentando a segurança e robustez do código.

2- NextAuth.js – Biblioteca de autenticação flexível para Next.js, utilizada com OAuth (Google).

3- Prisma ORM – ORM de nova geração usado para interagir com o banco de dados MongoDB com tipagem forte.

4- MongoDB Atlas – Banco de dados NoSQL usado como fonte principal de persistência dos dados.

🧩 Frontend
1- React – Biblioteca JavaScript declarativa para construção de interfaces.

2- Tailwind CSS (opcional, se estiver usando) – Framework utilitário para estilização rápida e responsiva.

3- React Toastify – Biblioteca para exibição de notificações elegantes e não intrusivas.

4- React Icons – Biblioteca de ícones integrável com diversas coleções (Feather, Material, etc.).

5- PDF.js (se estiver sendo usado) – Biblioteca para renderizar documentos PDF diretamente no navegador.

6- Componentes customizados – Modal de assinatura, containers e headers construídos com React.
```

## Funcionalidades

```
1. Autenticação
- Página de login/registro
- Proteção de rotas privadas
- Logout
- Gerenciamento básico de sessão

2. Gerenciamento de Documentos
- Listagem de documentos do usuário logado
- Upload de novos documentos (PDF)
- Visualização de documento
- Exclusão de documentos

3. Assinatura Digital (Simplificada)
- Interface para simular assinatura em documento
- Registro da assinatura com timestamp
- Status do documento (Pendente, Assinado)

```

## Explicação da Arquitetura

```
/
├── prisma/                         # Schema do Prisma ORM
│   └── schema.prisma
├── public/                         # Arquivos estáticos públicos
├── src/                            # Código-fonte principal
│   ├── @types/                     # Tipagens personalizadas
│   ├── app/                        # Rotas da aplicação e API
│   │   ├── api/                    # Rotas da API (backend)
│   │   │   ├── auth/               # Login e autenticação
│   │   │   ├── delete/             # Exclusão de documentos
│   │   │   ├── documents/          # Listagem geral de documentos
│   │   │   ├── get/                # Obtenção individual de dados/documentos
│   │   │   ├── register/           # Registro de usuários
│   │   │   ├── sign/               # Registro de assinatura
│   │   │   ├── sign-pdf/           # Lógica de assinatura visual no PDF
│   │   │   ├── upload/             # Upload de documentos (PDF)
│   │   │   └── view/               # Visualização de documentos assinados
│   │   ├── assets/                 # Recursos estáticos (ícones, imagens, etc.)
│   │   ├── dashboard/              # Página principal do usuário autenticado
│   │   ├── login/                  # Página de login
│   │   ├── layout.tsx              # Layout base da aplicação
│   │   ├── page.tsx                # Página inicial
│   │   ├── globals.css             # Estilos globais
│   │   └── favicon.ico             # Ícone da aba
│   ├── components/                 # Componentes reutilizáveis de UI
│   │   ├── container/              # Elementos de layout/responsividade
│   │   ├── header/                 # Cabeçalho da aplicação
│   │   ├── form.tsx                # Componente de formulário
│   │   └── PDFSignatureModal.tsx   # Modal para desenhar/registrar assinatura
│   ├── lib/                        # Lógica de autenticação e acesso a banco
│   │   ├── auth.ts                 # Configurações do NextAuth
│   │   └── prisma.ts               # Cliente Prisma (singleton)
│   └── providers/                  # Providers globais da aplicação
│       └── auth.tsx                # Provider de sessão/autenticação
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## Decisões técnicas

```
Durante o desenvolvimento do SuperSign, foram tomadas algumas decisões técnicas estratégicas para garantir escalabilidade, segurança, desempenho e organização do código. Abaixo estão as principais escolhas e justificativas:

📦 Next.js com App Router
Foi adotado o Next.js (App Router) por sua estrutura baseada em arquivos, renderização híbrida (SSG/SSR), performance otimizada e integração nativa com API Routes. O App Router oferece melhor separação de layout e página, além de suportar contextos mais granulares por rota.

🛠️ Estrutura Modular de API
As rotas da API foram divididas em subpastas temáticas dentro de app/api/:

/upload: responsável por receber arquivos PDF enviados pelo usuário.

/sign: manipula e registra assinaturas.

/view, /get, /delete: tratam ações específicas sobre os documentos.

Isso permite melhor organização do código, isolamento de responsabilidades e facilita a manutenção de cada operação.

🔐 Autenticação com NextAuth.js
Optou-se pelo NextAuth.js para autenticação, usando o provedor do Google. Essa escolha oferece:

Integração fácil com OAuth4

Criptografia de tokens JWT

Controle de sessão seguro no cliente e servidor

Proteção de rotas com getServerSession

🧠 Prisma ORM com MongoDB
O Prisma foi escolhido como ORM pela sua clareza no schema, tipagem forte com TypeScript e facilidade de uso com MongoDB (via MongoDB Atlas). Ele facilita queries complexas e garante consistência entre o banco e o código com validações de modelo.

🧩 Componentização
A interface foi construída com componentes reutilizáveis, agrupados por domínio (ex: header/, container/, PDFSignatureModal.tsx). Isso melhora a legibilidade do projeto e facilita a escalabilidade visual.

💡 Separação de Camadas
Foi aplicada uma separação clara entre:

Interface (app/, components/)

Lógica de autenticação e persistência (lib/)

Contextos globais (providers/)

API e rotas de backend (app/api/)

Essa divisão melhora a legibilidade do código, facilita testes e manutenções futuras.
```

## 📌 Exemplo de `.env.local` para desenvolvimento

```env
DATABASE_URL="mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<banco>?retryWrites=true&w=majority"
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
HOST_URL=http://localhost:3000
NEXTAUTH_SECRET=chave-super-secreta
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=sua-senha-secreta-google
ROOT_PATH="./"

Abra http://localhost:3000 no seu navegador para ver o resultado.

Você pode começar a editar a página modificando o arquivo app/DashboardClient.tsx. A página será atualizada automaticamente conforme você salva as alterações.

Este projeto utiliza o next/font para otimizar e carregar automaticamente a fonte Geist, uma nova família tipográfica desenvolvida pela Vercel.

Saiba Mais
Para saber mais sobre o Next.js, confira os seguintes recursos:

Documentação do Next.js – explore as funcionalidades e a API do framework.

Curso interativo de Next.js – aprenda Next.js na prática com um tutorial guiado.

Você também pode acessar o repositório oficial do Next.js no GitHub – feedbacks e contribuições são muito bem-vindos!

Deploy na Vercel
A maneira mais fácil de fazer o deploy da sua aplicação Next.js é utilizando a plataforma da Vercel, criada pelos desenvolvedores do próprio Next.js.

Confira a documentação de deploy do Next.js para mais detalhes.
```

## Desafios Encontrados
```
🚧 Desafios Encontrados
Durante o desenvolvimento do SuperSign, enfrentei alguns desafios importantes que contribuíram significativamente para o meu aprendizado:

Implementação da página de login: Apesar de utilizar o NextAuth, a construção da interface de login, especialmente o controle e o comportamento dos inputs, exigiu ajustes finos e atenção a estados controlados e validações — algo que exigiu testes e refinamentos para garantir uma boa experiência do usuário.

Upload de arquivos: Foi a primeira vez que trabalhei com manipulação direta de arquivos PDF no frontend e no backend. Lidar com a conversão para buffer, envio seguro dos arquivos foi um processo novo.

Assinatura digital (simulada): Desenvolver uma interface para que o usuário pudesse simular uma assinatura diretamente no navegador foi um dos maiores aprendizados. A manipulação gráfica, captura da "assinatura" e registro da ação com timestamp foram implementações inéditas para mim até então, exigindo pesquisa e experimentação com eventos de mouse e renderização no DOM.

Esses obstáculos foram superados com estudo, tentativa e erro, e resultaram em um código mais robusto e uma melhor compreensão das tecnologias utilizadas.
```

