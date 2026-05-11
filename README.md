This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
If tailwind isnt installed through the command below, install it through this command
```bash
npm install -D tailwindcss @tailwindcss/postcss
```


First, make sure you have all the dependencies installed
```bash
npm install
```

Run the development server:

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

## Starting/Testing Backend
Open up a new termina apart from the frontend terminal.
First cd into the backend
```bash
cd backend
```

Create the virtual environment
```bash
uv venv
```

Then activate the environment

(Windows)
```bash
.\.venv\Scripts\activate
```

(Mac/Linux)
```bash
source .venv/bin/activate
```

Then install all of the dependencies
```bash
uv pip install fastapi "uvicorn[standard]" pydantic pydantic-settings boto3
```

Lastly, run the server!
```bash
uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

To open Swagger UI make sure you are on this url:
http://127.0.0.1:8000/docs

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
