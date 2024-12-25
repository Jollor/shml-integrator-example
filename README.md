
## Getting Started

First, create a .env file and set the values of these environment variables as shown in the .env.example file.

Run the development server:

```bash
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Webhook testing

Run the localtunnel

```bash
npx localtunnel --port 3000
```

Copy the URL and format it as {url}/api/webhook. Then, set it in the following location: https://app-dev.jollor.com/projects/{project_id}/settings/webhooks





