```js
/**
 * ExamsForge - Diagram Generator (SVG)
 * File: /backend/engine/diagramGenerator.js
 */

const axios = require('axios');

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

async function generateDiagram(description) {

  const prompt = `
Generate a clean, labeled SVG diagram for an exam question.

Requirements:
- Black and white only
- Clear labels
- No styling beyond basic lines and text
- Suitable for printing

Description:
${description}

Return ONLY valid SVG code.
`;

  const response = await axios.post(
    CLAUDE_API_URL,
    {
      model: "claude-3-opus-20240229",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }]
    },
    {
      headers: {
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      }
    }
  );

  return response.data.content[0].text.trim();
}

module.exports = {
  generateDiagram
};
```
