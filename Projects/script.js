function analyzeResume() {
  const fileInput = document.getElementById("resumeInput");
  const output = document.getElementById("output");

  if (!fileInput.files.length) {
    output.innerHTML = "Please upload a resume file.";
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const text = e.target.result.toLowerCase();

    let score = 50;

    // Basic keyword checks
    if (text.includes("project")) score += 10;
    if (text.includes("skill")) score += 10;
    if (text.includes("experience")) score += 10;
    if (text.includes("education")) score += 10;
    if (text.includes("leadership")) score += 10;

    // Word count check
    const wordCount = text.split(/\s+/).length;
    if (wordCount > 300) score += 10;

    // Suggestions
    let suggestions = [];

    if (!text.includes("project"))
      suggestions.push("Add more projects to strengthen your resume.");
    if (!text.includes("skill"))
      suggestions.push("Include a clear skills section.");
    if (wordCount < 200)
      suggestions.push("Increase content depth in your resume.");

    output.innerHTML = `
      <h3>Resume Score: ${score}/100</h3>
      <p><strong>Word Count:</strong> ${wordCount}</p>
      <h4>Suggestions:</h4>
      <ul>
        ${suggestions.map(s => `<li>${s}</li>`).join("")}
      </ul>
    `;
  };

  reader.readAsText(file);
}