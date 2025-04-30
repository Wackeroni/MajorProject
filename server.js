const express = require("express")
const cors = require("cors")
const { GoogleGenerativeAI } = require("@google/generative-ai")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyA3Jyn6Hy7hthRwMYc_NPlFF3TOsUHWl9I")

// API endpoint for generating syllabus
app.post("/api/generate-syllabus", async (req, res) => {
  try {
    const { course, year, learningObjectives } = req.body

    // Create prompt
    const prompt = `
      Create a detailed academic syllabus for the following:
      
      Course: ${course}
      Year: ${year}
      Academic Year: 2025-2026
      Learning Objectives: ${learningObjectives}
      
      The syllabus should include:
      1. A semester breakdown (Semester 1: April 2025 - August 2025, Semester 2: October 2025 - February 2026)
      2. Weekly topics and learning objectives
      3. Term breaks (June 2025 and December 2025)
      4. Assessment schedules (mid-term tests, final exams)
      5. Project deadlines and presentations
      6. Required reading materials or resources
      7. Learning outcomes for each module
      
      Format the syllabus in a structured, easy-to-read format with clear headings and sections.
    `

    // Use the latest Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    res.json({ success: true, syllabus: text })
  } catch (error) {
    console.error("Error generating syllabus:", error)
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.toString(),
    })
  }
})

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
