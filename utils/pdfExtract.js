const path = require("path");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

// IMPORTANT: worker ka path set karo
pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(
  __dirname,
  "../node_modules/pdfjs-dist/legacy/build/pdf.worker.js"
);

async function extractTextFromBuffer(buffer) {
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
