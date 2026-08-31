// ============================================
// ARETE AGORA — Zoom meeting creator
// Runs on Netlify's servers (never in the visitor's browser),
// because it needs your secret Zoom credentials.
// Needs three environment variables set in Netlify:
// ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET
// (see SETUP.md for how to get these)
// ============================================

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { topic } = JSON.parse(event.body || '{}');

    // Step 1: exchange your Zoom app credentials for a temporary access token
    const tokenResponse = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
      {
        method: 'POST',
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64')
        }
      }
    );
    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Zoom auth failed', detail: tokenData }) };
    }

    // Step 2: create the meeting
    const meetingResponse = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic: topic || 'Arete Agora Session',
        type: 1, // instant meeting
        settings: {
          join_before_host: true,
          waiting_room: false
        }
      })
    });
    const meetingData = await meetingResponse.json();

    if (!meetingData.join_url) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Zoom meeting creation failed', detail: meetingData }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ joinUrl: meetingData.join_url })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
