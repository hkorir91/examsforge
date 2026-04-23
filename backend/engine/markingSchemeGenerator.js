```js
/**
 * ExamsForge - Marking Scheme Generator
 * File: /backend/engine/markingSchemeGenerator.js
 */

const puppeteer = require('puppeteer');

// -------------------------------
// 🧾 BUILD MARKING SCHEME HTML
// -------------------------------
function buildMarkingHTML(exam) {
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

  h2 {
    text-align: center;
  }

  .section {
    margin-top: 25px;
  }

  .question {
    margin-bottom: 15px;
  }

  .answer {
    margin-left: 15px;
    font-size: 14px;
  }
</style>
</head>

<body>

<h2>${exam.subject.toUpperCase()} - MARKING SCHEME</h2>
<p style="text-align:center;">${exam.grade}</p>

${exam.sections.map(section => `
  <div class="section">
    <h3>${section.section}</h3>

    ${section.questions.map((q, index) => `
      <div class="question">
        <strong>Q${index + 1} (${q.marks} marks)</strong>
        <div class="answer">${q.answerGuide}</div>
      </div>
    `).join("")}
  </div>
`).join("")}

</body>
</html>
`;
}

// -------------------------------
// 🖨️ GENERATE MARKING PDF
// -------------------------------
async function generateMarkingSchemePDF(exam) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const html = buildMarkingHTML(exam);

  await page.setContent(html, { waitUntil: "load" });

  const filename = `marking_${Date.now()}.pdf`;

  await page.pdf({
    path: `./generated/${filename}`,
    format: "A4",
    printBackground: true
  });

  await browser.close();

  return filename;
}

module.exports = {
  generateMarkingSchemePDF
};
```
