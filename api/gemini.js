// This file will be deployed as a serverless function on Vercel
export default function handler(req, res) {
  // Only allow POST requests to prevent API key exposure in URL
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // Get the prompt from the request body
  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" })
  }

  // Access the environment variable securely on the server
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" })
  }

  // Return the API key and prompt for the client to use
  // In a production app, you would make the actual API call here
  // and only return the results to keep the API key secure
  return res.status(200).json({
    success: true,
    message: "API request processed",
  })
}
