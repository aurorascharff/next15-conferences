# Next.js 16 Conference Explorer

An interactive conference explorer app built with Next.js 15, React 19 features, View Transitions, Ariakit, Tailwind CSS v4 and Prisma.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install the dependencies

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Prisma Setup

You need decide between prisma local development with `sqlite` or a real database with for example `postgresql` or `sqlserver`. Define it in the `schema.prisma` file.

Consider adding a `.env` file to the root of the project and use the environment variables inside `schema.prisma` with `env("DATABASE_URL")`, refer to `.env.sample`.

When using sqlite, initialize the database with:

```bash
npm run prisma.push
```

Seed prisma/seed.ts for initial data:

```sh
npm run prisma.seed
```

When using a real database with for example postgresql or sqlserver, you need to migrate the database schema with:

```bash
npm run prisma.migrate
```

NB! The following option, used in `talk.ts`, for case insensitivity is not supported nor needed with i.e sqlite:

```ts
filter.q.toLowerCase(), mode: 'insensitive' }
```

Remove this option to make it work with sqlite.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
