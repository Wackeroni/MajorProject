document.addEventListener("DOMContentLoaded", () => {
  // TP courses (T1-T72)
  const tpCourses = [
    { code: "T01", name: "Diploma in Common Business Programme" },
    { code: "T02", name: "Diploma in Accountancy & Finance" },
    { code: "T04", name: "Diploma in Aviation Management" },
    { code: "T07", name: "Diploma in International Trade & Logistics" },
    { code: "T08", name: "Diploma in Hospitality & Tourism Management" },
    { code: "T09", name: "Diploma in Law & Management" },
    { code: "T10", name: "Diploma in Business" },
    { code: "T13", name: "Diploma in Computer Engineering" },
    { code: "T18", name: "Diploma in Culinary & Catering Management" },
    { code: "T20", name: "Diploma in Fashion Management & Design" },
    { code: "T22", name: "Diploma in Interior Architecture & Design" },
    { code: "T23", name: "Diploma in Digital Film & Television"},
    { code: "T25", name: "Diploma in Pharmaceutical Science" },
    { code: "T26", name: "Diploma in Food, Nutrition & Culinary Science" },
    { code: "T29", name: "Diploma in Architectural Technology & Building Services" },
    { code: "T30", name: "Diploma in Information Technology" },
    { code: "T33", name: "Diploma in Chemical Engineering" },
    { code: "T35", name: "Diploma in Product Experience & Design" },
    { code: "T40", name: "Diploma in Communications & Media Management" },
    { code: "T43", name: "Diploma in Business Process & Systems Engineering" },
    { code: "T45", name: "Diploma in Veterinary Technology" },
    { code: "T48", name: "Diploma in Psychology Studies" },
    { code: "T50", name: "Diploma in Aerospace Electronics" },
    { code: "T51", name: "Diploma in Aerospace Engineering" },
    { code: "T53", name: "Diploma in Social Sciences in Gerontology" },
    { code: "T54", name: "Diploma in Robotics & Automation" },
    { code: "T56", name: "Diploma in Common Engineering Programme" },
    { code: "T58", name: "Diploma in Immersive Media & Game Development" },
    { code: "T59", name: "Diploma in Communication Design" },
    { code: "T60", name: "Diploma in Big Data & Analytics" },
    { code: "T62", name: "Diploma in Cybersecurity & Digital Forensics" },
    { code: "T63", name: "Diploma in ICT Programme" },
    { code: "T64", name: "Diploma in Medical Biotechnology" },
    { code: "T65", name: "Diploma in Electronics" },
    { code: "T66", name: "Diploma in Mechatronics" },
    { code: "T67", name: "Diploma in Marketing" },
    { code: "T68", name: "Diploma in Early Childhood Development & Education" },
    { code: "T69", name: "Diploma in Applied Artificial Intelligence" },
    { code: "T70", name: "Diploma in Common Science Programme"},
    { code: "T71", name: "Diploma in Common Design Programme"},
  ]

  // Populate course dropdown
  const courseSelect = document.getElementById("course")
  tpCourses.forEach((course) => {
    const option = document.createElement("option")
    option.value = `${course.code} - ${course.name}`
    option.textContent = `${course.code} - ${course.name}`
    courseSelect.appendChild(option)
  })

  // Elements
  const generateBtn = document.getElementById("generate-btn")
  const downloadBtn = document.getElementById("download-btn")
  const newSyllabusBtn = document.getElementById("new-syllabus-btn")
  const formContainer = document.querySelector(".form-container")
  const loadingContainer = document.querySelector(".loading-container")
  const resultContainer = document.querySelector(".result-container")
  const syllabusContent = document.querySelector(".syllabus-content")

  // Google Gemini API configuration
  const API_KEY = window.GEMINI_API_KEY || "AIzaSyA3Jyn6Hy7hthRwMYc_NPlFF3TOsUHWl9I" // Fallback if not set
  const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent"

  // Declare html2pdf variable
  const html2pdf = window.html2pdf

  // Generate Syllabus
  generateBtn.addEventListener("click", async () => {
    const course = document.getElementById("course").value
    const year = document.getElementById("year").value
    const learningObjectives = document.getElementById("learning-objectives").value

    // Validate inputs
    if (!course || !year || !learningObjectives) {
      alert("Please fill in all fields")
      return
    }

    // Show loading animation
    formContainer.style.display = "none"
    loadingContainer.style.display = "flex"
    resultContainer.style.display = "none"

    try {
      const syllabus = await generateSyllabus(course, year, learningObjectives)
      displaySyllabus(syllabus)
    } catch (error) {
      console.error("Error generating syllabus:", error)
      alert("An error occurred while generating the syllabus. Please try again.")
      formContainer.style.display = "block"
      loadingContainer.style.display = "none"
    }
  })

  // Generate syllabus using Google Gemini API
  async function generateSyllabus(course, year, learningObjectives) {
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

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    }

    // Use the environment variable API key
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  }

  // Display the generated syllabus
  function displaySyllabus(syllabusText) {
    // Convert plain text to HTML with proper formatting
    const formattedSyllabus = formatSyllabusText(syllabusText)

    // Display the syllabus
    syllabusContent.innerHTML = formattedSyllabus

    // Hide loading, show result
    loadingContainer.style.display = "none"
    resultContainer.style.display = "block"
  }

  // Format syllabus text to HTML
  function formatSyllabusText(text) {
    // Replace line breaks with <br>
    let formatted = text.replace(/\n/g, "<br>")

    // Format headings
    formatted = formatted.replace(/^# (.*?)$/gm, "<h3>$1</h3>")
    formatted = formatted.replace(/^## (.*?)$/gm, "<h4>$1</h4>")
    formatted = formatted.replace(/^### (.*?)$/gm, "<h5>$1</h5>")

    // Format lists
    formatted = formatted.replace(/^\* (.*?)$/gm, "<li>$1</li>")
    formatted = formatted.replace(/^\d+\. (.*?)$/gm, "<li>$1</li>")

    // Wrap lists
    formatted = formatted.replace(/(<li>.*?<\/li>)+/g, "<ul>$&</ul>")

    // Format term breaks and assessments
    formatted = formatted.replace(/Term Break:.*?<br>/g, '<div class="term-break">$&</div>')
    formatted = formatted.replace(/(Assessment|Test|Exam|Quiz):.*?<br>/g, '<div class="assessment">$&</div>')

    // Format bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Format italic text
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>")

    return formatted
  }

  // Download as PDF
  downloadBtn.addEventListener("click", () => {
    const course = document.getElementById("course").value
    const year = document.getElementById("year").value

    const element = document.querySelector(".result-container")
    const options = {
      margin: 10,
      filename: `${course}_${year}_Syllabus.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }

    html2pdf().set(options).from(element).save()
  })

  // Create new syllabus
  newSyllabusBtn.addEventListener("click", () => {
    formContainer.style.display = "block"
    resultContainer.style.display = "none"

    // Reset form
    document.getElementById("course").selectedIndex = 0
    document.getElementById("year").selectedIndex = 0
    document.getElementById("learning-objectives").value = ""
  })

  // Add animation to the page
  document.querySelectorAll(".form-group").forEach((element, index) => {
    element.style.animation = `fadeInUp ${0.3 + index * 0.1}s ease-out`
  })
})
