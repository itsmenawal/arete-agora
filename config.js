// ============================================
// ARETE AGORA — Configuration
// This is the ONLY file where you paste your real keys.
// Every other file reads from here. See SETUP.md for where
// each value comes from.
// ============================================

// ---- Supabase (your database) ----
// Supabase dashboard → Project Settings → API
const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL_HERE";
const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

// ---- EmailJS (sends the Zoom link emails) ----
// EmailJS dashboard → Account → General → Public Key
const EMAILJS_PUBLIC_KEY = "PASTE_YOUR_EMAILJS_PUBLIC_KEY_HERE";
// EmailJS dashboard → Email Services → your service's ID
const EMAILJS_SERVICE_ID = "PASTE_YOUR_EMAILJS_SERVICE_ID_HERE";
// EmailJS dashboard → Email Templates → your template's ID
const EMAILJS_TEMPLATE_ID = "PASTE_YOUR_EMAILJS_TEMPLATE_ID_HERE";

// ---- Shared setup (do not edit below this line) ----
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
emailjs.init(EMAILJS_PUBLIC_KEY);

async function sendMatchEmail(toEmail, toName, otherName, zoomLink, topic) {
  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email: toEmail,
    to_name: toName,
    other_name: otherName,
    zoom_link: zoomLink,
    topic: topic
  });
}

async function createZoomMeeting(topic) {
  const res = await fetch('/.netlify/functions/create-zoom-meeting', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic })
  });
  if (!res.ok) throw new Error('Could not create Zoom meeting');
  const data = await res.json();
  return data.joinUrl;
}
