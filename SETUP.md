# Arete Agora — Complete Setup Guide

This is everything you need to do **outside of code** to make the site fully work: real database, real Zoom links, real emails. Work through it top to bottom — each part builds on the last.

You will end up with **one file you edit** (`config.js`) — every key you collect below gets pasted into that one file, in one place.

---

## Part 1 — Supabase (your database)

### 1.1 Create the project
1. Go to **supabase.com** → sign up (free) → **New project**
2. Name it `arete-agora`, set a database password (save it somewhere), choose the closest region → **Create new project**
3. Wait about 2 minutes while it sets up

### 1.2 Create your tables
1. In the left sidebar, click **SQL Editor**
2. Click **New query**
3. Open the `schema.sql` file I gave you, copy **everything** in it, paste it into the query box
4. Click **Run** (bottom right)
5. You should see "Success. No rows returned" — that means your 4 tables now exist

### 1.3 Get your keys
1. In the left sidebar, click the gear icon → **API** (or **Project Settings → API**)
2. You'll see two things you need:
   - **Project URL** — looks like `https://xxxxx.supabase.co`
   - **anon public** key — a long string under "Project API keys"
3. Keep this tab open — you'll paste these into `config.js` in Part 4

---

## Part 2 — Zoom (auto-creating meeting links)

Zoom link creation needs a Zoom **Server-to-Server OAuth app** — this is the option Zoom recommends now instead of older API key methods.

### 2.1 Create the app
1. Go to **marketplace.zoom.us** → sign in with your Zoom account (a free Zoom account works)
2. Click **Develop** (top right) → **Build App**
3. Choose **Server-to-Server OAuth** → give it a name like "Arete Agora" → **Create**

### 2.2 Get your credentials
On the app's page, under **App Credentials**, you'll see three values:
- **Account ID**
- **Client ID**
- **Client Secret**

Copy all three somewhere safe — you'll paste them into Netlify (not into your code files) in Part 4.

### 2.3 Add the required scope
1. On the same app page, go to the **Scopes** tab
2. Click **Add Scopes**
3. Search for and add: `meeting:write:meeting:admin` (or the closest "Create a meeting" scope Zoom shows you)
4. Save

### 2.4 Activate the app
Go to the **Activation** tab and activate it. (You may need to fill in a short description of what the app does — "Creates meeting links for a peer tutoring platform" is fine.)

---

## Part 3 — EmailJS (sending the Zoom link emails)

### 3.1 Create your account
1. Go to **emailjs.com** → sign up free
2. Go to **Email Services** → **Add New Service** → connect your Gmail (`areteagora@gmail.com`) → follow the prompts to authorize it
3. Note the **Service ID** it gives you

### 3.2 Create your email template
1. Go to **Email Templates** → **Create New Template**
2. Set it up like this:
   - **To email**: `{{to_email}}`
   - **Subject**: `Your Arete Agora session is confirmed!`
   - **Body** (example — feel free to restyle):
     ```
     Hi {{to_name}},

     You've been matched with {{other_name}} for: {{topic}}

     Join here: {{zoom_link}}

     — Arete Agora
     ```
3. Save, and note the **Template ID**

### 3.3 Get your public key
Go to **Account → General** → copy your **Public Key**

---

## Part 4 — Put it all together

### 4.1 Fill in config.js
Open `config.js` (one of the files I gave you) and replace these four placeholders with the real values you collected:

| Placeholder in config.js | Comes from |
|---|---|
| `PASTE_YOUR_SUPABASE_URL_HERE` | Part 1.3 |
| `PASTE_YOUR_SUPABASE_ANON_KEY_HERE` | Part 1.3 |
| `PASTE_YOUR_EMAILJS_PUBLIC_KEY_HERE` | Part 3.3 |
| `PASTE_YOUR_EMAILJS_SERVICE_ID_HERE` | Part 3.1 |
| `PASTE_YOUR_EMAILJS_TEMPLATE_ID_HERE` | Part 3.2 |

Save the file.

### 4.2 Add your Zoom credentials to Netlify
These are secrets, so they do **not** go in any code file — they go directly into Netlify:
1. Go to your site on **app.netlify.com**
2. **Project configuration → Environment variables**
3. Add three variables:
   - `ZOOM_ACCOUNT_ID` → your Account ID from Part 2.2
   - `ZOOM_CLIENT_ID` → your Client ID from Part 2.2
   - `ZOOM_CLIENT_SECRET` → your Client Secret from Part 2.2

---

## Part 5 — Upload everything to GitHub

Your repository needs ALL of these files, keeping the folder structure exactly as-is:

```
arete-agora/
├── index.html
├── study.html
├── teach.html
├── debate.html          ← new
├── courses.html
├── styles.css
├── config.js             ← new, this is the one you edited
└── netlify/
    └── functions/
        └── create-zoom-meeting.js    ← new
```

**Important:** the `netlify/functions/create-zoom-meeting.js` file must stay inside those exact nested folders — Netlify only looks for functions in that specific location.

To upload the new nested folder on GitHub's website:
1. Go to your repository → **Add file → Upload files**
2. Drag in `debate.html`, `config.js`, and the updated `study.html`, `teach.html`, `index.html`, `courses.html`, `styles.css` — these all go in the main folder
3. For the function file: type `netlify/functions/create-zoom-meeting.js` directly into the file name box when uploading that one file — GitHub will create the folders automatically
4. Scroll down → **Commit changes**

Netlify will automatically redeploy within about a minute of the commit.

---

## Part 6 — Test it for real

1. Open your live site → go to **Study** → submit a fake request for yourself
2. Open **Teach** in another tab → enter a different name/email → pick the same time slot → you should see your fake request appear
3. Click **Claim this student** → within a few seconds you should see a success message, and both emails should receive the Zoom link
4. Repeat the same test on the **Debate** page with two fake entries

If something fails at the claim step, the error message on the page will usually tell you which part broke (Zoom vs. email vs. database) — send me that exact message and I'll help you fix it.

---

## What's still not built (later work)

- Certificate automation after 20 sessions
- On-site course enrollment with the 50-student cap and deadline
- Any admin view to see everything happening across the site

We'll tackle these next, once this part is confirmed working.
