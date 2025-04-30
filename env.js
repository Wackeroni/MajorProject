// This script injects environment variables into the window object
// It should be included before other scripts
;(() => {
  // For Vercel deployments with NEXT_PUBLIC_ prefix
  window.GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || null

  // Log status (remove in production)
  if (window.GEMINI_API_KEY) {
    console.log("API key loaded from environment variables")
  } else {
    console.log("Using fallback API key")
  }
})()
