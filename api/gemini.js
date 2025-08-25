// File: netlify/functions/gemini.js

// This is a serverless function that runs on a backend.
exports.handler = async function (event) {
  // 1. Get the user's prompt from the request sent by your HTML file.
  const { prompt } = JSON.parse(event.body);

  // 2. Securely get your API key from the environment variable on the server.
  //    You will set this up when you deploy the site.
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

  try {
    // 3. The server securely calls the Gemini API. The key is never exposed.
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText };
    }

    const data = await response.json();

    // 4. Send the response from Gemini back to your HTML file.
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
