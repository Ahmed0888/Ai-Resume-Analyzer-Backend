const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

async function extractTextFromBuffer(buffer) {
  // buffer: Node Buffer
  const uint8 = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({ data: uint8 });
  const pdf = await loadingTask.promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((it) => it.str);
    fullText += strings.join(" ") + "\n\n";
  }
  return fullText.trim();
}

module.exports = { extractTextFromBuffer };
