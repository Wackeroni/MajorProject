document.addEventListener("DOMContentLoaded", () => {
  // Temasek Polytechnic courses (T1-T69)
  const tpCourses = [
    { code: "T01", name: "Diploma in Accountancy & Finance" },
    { code: "T02", name: "Diploma in Business" },
    // ... other courses (keeping them for brevity)
    { code: "T69", name: "Diploma in FinTech & Business Innovation" },
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

  // Generate syllabus using our server API
  async function generateSyllabus(course, year, learningObjectives) {
    const response = await fetch("/api/generate-syllabus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course,
        year,
        learningObjectives,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data.syllabus
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
