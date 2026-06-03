# Journal Entry AI Checker

A simple rule-based practice app for beginner journal entries. Students can enter a transaction, write a one-debit and one-credit journal entry, and get a score, correction, and short explanation.

## Local Setup

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

## Useful Commands

Run tests:

```bash
npm test
```

Run type checking:

```bash
npm run typecheck
```

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Start the production server locally after building:

```bash
npm run start
```

## API Routes

The app uses rule-based API routes only:

- `POST /api/check-entry`
- `GET /api/generate-practice-question`

There is no database, login, external AI API, or required environment variable.

## Vercel Deployment Notes

This is a standard Next.js app and can be deployed directly to Vercel.

Recommended Vercel settings:

- Framework preset: `Next.js`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: leave as Vercel default
- Environment variables: none required for the current MVP

Before deploying, verify locally:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

The API routes are serverless-compatible because they do not depend on local files, local services, a database, or secret keys.
