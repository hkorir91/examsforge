```js
/**
 * ExamsForge - PDF Generator
 * File: /backend/engine/pdfGenerator.js
 *
 * Converts exam JSON into a professional A4 PDF
 */

const puppeteer = require('puppeteer');

// -------------------------------
// 🧾 BUILD HTML TEMPLATE
// -------------------------------
function buildHTML(exam) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body {
    font-family: "Times New Roman", serif;
    margin: 40px;
    line-height: 1.5;
  }

  h1, h2 {
    text-align: center;
  }

  .header {
    text-align: center;
    margin-bottom: 20px;
  }

  .section {
    margin-top: 30px;
  }

  .question {
    margin-bottom: 15px;
  }

  .marks {
    float: right;
  }

  hr {
    margin: 20px 0;
  }
</style>
</head>

<body>

<div class="header">
  <h2>${exam.subject.toUpperCase()}</h2>
  <p>${exam.grade}</p>
  <p><strong>Time: 2 Hours</strong></p>
  <p><strong>Total Marks: ${exam.totalMarks}</strong></p>
</div>

<hr />

${exam.sections.map(section => `
  <div class="section">
    <h3>${section.section}</h3>

    ${section.questions.map((q, index) => `
      <div class="question">
        <span>${index + 1}. ${q.questionText}</span>
        <span class="marks">(${q.marks} marks)</span>
      </div>
    `).join("")}
  </div>
`).join("")}

</body>
</html>
`;
}

// -------------------------------
// 🖨️ GENERATE PDF
// -------------------------------
async function generatePDF(exam) {
  const browser = await puppeteer.launch({
    headless: "new"
  });

  const page = await browser.newPage();

  const html = buildHTML(exam);

  await page.setContent(html, { waitUntil: "load" });

  const filename = `exam_${Date.now()}.pdf`;

  await page.pdf({
    path: `./generated/${filename}`,
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm"
    }
  });

  await browser.close();

  return filename;
}

module.exports = {
  generatePDF
};
```
