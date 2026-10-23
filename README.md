# CRUSH CODE ♡

**Love is complicated. Let's decode it.**

An AI-powered love and dating website built with Next.js (App Router), TypeScript and Tailwind CSS. Every AI feature calls the real OpenAI API (`gpt-4o`) through secure server-side API routes. The API key never reaches the browser.

## Features

| Page | Route | What it does |
| --- | --- | --- |
| Love Calculator | `/love-calculator` | Deterministic, entertainment-only score (0–100%) across 5 categories + AI interpretation |
| Red Flag Detector | `/red-flag-detector` | AI verdict: GREEN FLAG, MIXED SIGNALS or RED FLAG, with explanation and advice |
| Zodiac Love Match | `/zodiac-match` | Pick two signs, get a playful 5-part compatibility reading |
| Text Decoder | `/text-decoder` | Possible interpretations of a message + SWEET, FLIRTY and BOLD replies |
| Love Guru | `/love-guru` | Chatbot with history and the LOVE TEMPERATURE™ slider (real `temperature`, 0.0–2.0, default 0.7) and the REALITY VS. DELULU ♡ comparison (two real calls at 0.2 and 1.4) |
| Love Letter Generator | `/love-letter` | Personal letter on vintage stationery, with copy button |

---

## Deploy entirely in your browser (no installs)

You need: a free **GitHub** account, a free **Vercel** account, and an **OpenAI API key** with a little credit.

### 1. Put the code on GitHub

1. Unzip `crush-code.zip` on your computer.
2. Go to **github.com → + (top right) → New repository**.
3. Name it `crush-code`, choose **Private** or Public, and click **Create repository**. Do not add a README.
4. On the empty repository page, click the link **"uploading an existing file"**.
5. Open the unzipped `crush-code` folder, select **everything inside it** (the `app`, `components`, `lib` folders and all the files), and drag it onto the GitHub page.
   - Drag the *contents* of the folder, not the folder itself, so `package.json` ends up at the top level of the repository.
   - On a Mac, hidden files like `.gitignore` may not be visible. That's okay, the site still deploys. To include them, press **Cmd + Shift + .** in Finder first.
6. Click **Commit changes**.

### 2. Deploy on Vercel

1. Go to **vercel.com** and **Sign up with GitHub**.
2. Click **Add New… → Project** and **Import** your `crush-code` repository.
3. Vercel detects **Next.js** automatically. Leave the build settings as they are.
4. Open **Environment Variables** and add:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** your OpenAI key (starts with `sk-`), pasted directly into Vercel, nowhere else.
5. Click **Deploy**. After about a minute you get a live link like `crush-code.vercel.app`.

If you add or change the key later: **Project → Settings → Environment Variables**, then **Deployments → ⋯ → Redeploy**.

### 3. Get an OpenAI API key

1. Go to **platform.openai.com → API keys → Create new secret key**.
2. Add a small amount of credit under **Settings → Billing**.
3. **Recommended:** set a monthly budget under **Settings → Limits** so costs can never surprise you.

Never paste your key into a chat, a GitHub file, or the website code.

### Changing things later

Edit any file directly on github.com (click the file → pencil icon → **Commit changes**). Vercel redeploys automatically.

---

## Cost and safety controls

- **Model:** `gpt-4o` for every feature (set in `lib/openai.ts`; the optional `OPENAI_MODEL` env var overrides it, e.g. `gpt-4o-mini` to cut costs).
- **Short answers:** every route sets `max_tokens` (260–620).
- **Short history:** Love Guru sends only the last 10 messages, each user message max 800 characters.
- **Rate limiting:** per visitor (IP), per 10 minutes: 15 calls per feature (12 for letters, 40 for Love Guru), max 60 calls overall. The REALITY VS. DELULU ♡ button counts as 2. The limiter lives in server memory, so it's a sensible first defence; your OpenAI budget limit is the hard cap.
- **No duplicate calls:** buttons are disabled while a request is running.
- **Validation:** all input is checked on the server (length, allowed options) before any API call.
- **Key safety:** the key is read only in server code (`lib/openai.ts`) from `process.env.OPENAI_API_KEY`.

## How the prompts are built

All prompts live in the API routes (`app/api/*/route.ts`) and share building blocks from `lib/prompts.ts`. Each one follows the same structure:

- **Role / persona:** a witty, kind dating columnist.
- **Target audience:** young adults looking for fun, practical help.
- **Task + step-by-step instructions** (chain of thought): e.g. the Red Flag Detector first lists the concrete behaviours, then weighs healthy vs. warning signs, then picks one verdict.
- **Exact response format:** JSON with named fields and word limits, so the page can display results reliably.
- **Limited scope** and **positive + negative instructions:** what to include, and what to avoid (AI clichés, claiming to know someone's feelings, explicit content, manipulation tips).
- **Safety rule:** if someone describes abuse or feeling unsafe, the tone turns serious and points to real help.
- **Prompt-injection guard:** user text is wrapped in `<user_input>` tags and treated as data.

**High-temperature guard:** the slider always sends the real temperature, but above 1.0 the app also narrows `top_p` (1.4 → 0.8, 2.0 → 0.5). Without this, GPT models produce made-up words at very high temperatures.

Temperatures are chosen per task: low (0.4) for the Red Flag Detector, where consistency matters, and higher (0.8–0.95) for creative writing. The Love Guru temperature is controlled by the user.

## Run locally (optional, needs Node.js 20+)

```bash
npm install
cp .env.example .env.local   # then add your key
npm run dev
```

## Disclaimer

Love scores, astrology and AI readings are for entertainment only. The AI suggests possibilities and cannot know what another person thinks or feels.
