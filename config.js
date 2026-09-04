// ============================================
// ARETE AGORA — Configuration
// This is the ONLY file where you paste your real keys.
// Every other file reads from here. See SETUP.md for where
// each value comes from.
// ============================================

// ---- Supabase (your database) ----
// Supabase dashboard → Project Settings → API
const SUPABASE_URL = "https://mmairgkukzpwsmaqahec.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tYWlyZ2t1a3pwd3NtYXFhaGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxODk5MDEsImV4cCI6MjEwMzc2NTkwMX0.ofRBcQUfLcH3h9KFjXoll55kX3IbCoLOaoczmP9b4Us";

// ---- EmailJS (sends the Zoom link emails) ----
// EmailJS dashboard → Account → General → Public Key
const EMAILJS_PUBLIC_KEY = "6u2H3bRB7eFedd4B7";
// EmailJS dashboard → Email Services → your service's ID
const EMAILJS_SERVICE_ID = "service_2at37vf";
// EmailJS dashboard → Email Templates → your template's ID
const EMAILJS_TEMPLATE_ID = "template_wtnr60v";

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
