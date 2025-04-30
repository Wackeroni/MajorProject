// Configuration file for environment variables
const config = {
  // For Vercel deployment, environment variables are injected at build time
  // Client-side code can only access variables prefixed with NEXT_PUBLIC_
  GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyA3Jyn6Hy7hthRwMYc_NPlFF3TOsUHWl9I",
}
