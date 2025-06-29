document.getElementById("resume-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const data = {
    name: form.name.value,
    education: {
      degree: form.degree.value,
      institution: form.institution.value,
      year: form.year.value
    },
    experience: {
      title: form.title.value,
      company: form.company.value,
      duration: form.duration.value,
      description: form.workDesc.value
    },
    skills: form.skills.value
  };

  const response = await fetch("http://localhost:3000/generate-resume", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  const resumeText = result.resume;

  document.getElementById("result").innerHTML = `<pre id="resume-content">${resumeText}</pre>`;
  document.getElementById("download-pdf").style.display = "block"; // show button
});

// Handle PDF download
document.getElementById("download-pdf").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const resumeContent = document.getElementById("resume-content").innerText;

  const lines = doc.splitTextToSize(resumeContent, 180); // Wrap text at 180 width
  doc.text(lines, 10, 10);

  doc.save("resume.pdf");
});
