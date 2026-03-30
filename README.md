# Troop 42 Black Mountain

Family scout group website for Troop 42 in Black Mountain, NC. A full-stack web application for managing troop events, blog posts, scoutmaster notes, announcements, resources, and notifications.

## Tech Stack

- **Frontend:** React 19, Vite 6, Tailwind CSS, Framer Motion, TipTap Editor
- **Backend:** Express.js, TypeScript, Zod validation
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT with cookie-based sessions, Google OAuth support
- **AI:** OpenRouter integration for content assistance

## Prerequisites

- [Node.js](https://nodejs.org/) v22 or later
- [PostgreSQL](https://www.postgresql.org/) 15 or later
- [Railway CLI](https://docs.railway.app/guides/cli) (for deployment)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/realityinspector/troop42-black-mountain.git
   cd troop42-black-mountain
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in your database credentials and secrets.

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Set up the database**

   ```bash
   npx prisma db push
   ```

5. **Seed the database** (optional, loads sample data)

   ```bash
   npm run db:seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

   The frontend runs at `http://localhost:5173` and the API at `http://localhost:3042`.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start frontend and backend in development mode |
| `npm run build` | Build frontend (Vite) and compile server (TypeScript) |
| `npm start` | Run the production server |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:push` | Push schema changes to the database |
| `npm run db:seed` | Seed the database with sample data |
| `npm run db:studio` | Open Prisma Studio for database inspection |

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3042` |
| `NODE_ENV` | Environment (`development` or `production`) | `development` |
| `DATABASE_URL` | PostgreSQL connection string | -- |
| `JWT_SECRET` | Secret key for JWT token signing | -- |
| `AUTH_DEV_TOKEN` | Development authentication token | -- |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | -- |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | -- |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI features | -- |
| `VITE_APP_URL` | Public URL of the app (used by frontend) | `http://localhost:5173` |
| `APP_URL` | Public URL of the app (used by server) | `http://localhost:5173` |

## Deployment

This project is configured for deployment on [Railway](https://railway.app/).

### Manual Deployment

```bash
railway login
railway up
```

### CI/CD

Push to `main` deploys to production. Push to `dev` deploys to the staging environment. See `.github/workflows/deploy.yml` for the full pipeline.

**Required GitHub Secrets:**

- `RAILWAY_TOKEN` -- Railway API token
- `RAILWAY_SERVICE_ID` -- Railway service identifier

## Project Structure

```
troop42-black-mountain/
├── prisma/              # Database schema and seed script
├── public/              # Static assets
├── server/              # Express.js backend
│   ├── db.ts            # Prisma client instance
│   ├── middleware/       # Auth and validation middleware
│   └── routes/          # API route handlers
├── src/                 # React frontend
│   ├── assets/          # Images and static files
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and API client
│   └── pages/           # Page components and routes
├── Dockerfile           # Multi-stage Docker build
├── railway.json         # Railway deployment config
├── tsconfig.json        # TypeScript config (client)
├── tsconfig.server.json # TypeScript config (server)
└── vite.config.ts       # Vite build configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please make sure your code passes type checking (`npx tsc --noEmit`) and builds successfully (`npm run build`) before submitting a PR.

## License

This project is licensed under the [MIT License](LICENSE).

## Trademark Notice

"Boy Scouts of America," "BSA," and all related names, logos, and marks are registered trademarks of the Boy Scouts of America. This website is operated by a local troop and is not an official BSA publication. Use of BSA trademarks is in accordance with BSA policy for local unit websites.
