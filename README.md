# Sequence Analyzer App (Vercel-ready)

## Local development
1. Install dependencies:
   npm install
2. Create a `.env` file from `.env.example` and add your server-side Anthropic key:
   ANTHROPIC_API_KEY=your_api_key_here
3. Run:
   npm run dev

## Deploy on Vercel
1. Push this project to GitHub.
2. Import the repo into Vercel.
3. In Vercel → Project Settings → Environment Variables, add:
   - `ANTHROPIC_API_KEY` = your Anthropic API key
4. Deploy.

## Security change made
The frontend no longer sends requests directly to Anthropic.
It now calls `/api/claude`, and the Anthropic key stays on the server in Vercel environment variables.
Initial Vercel deployment trigger
