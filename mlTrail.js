
 const Tesseract = require('tesseract.js');

// Function to extract date of birth from image
function extractDOBFromImage(imagePath) {
  Tesseract.recognize(
      imagePath,
      'eng',  // Language to use for OCR
      {
          logger: (m) => console.log(m)  // Optional: logs OCR progress
      }
  ).then(({ data: { text } }) => {
      console.log("Extracted Text:", text);

      // Regex pattern to find DOB in common formats (e.g., dd/mm/yyyy or dd-mm-yyyy)
      const dobPattern = /\b(\d{2}[\/-]\d{2}[\/-]\d{4})\b/g;
      const match = text.match(dobPattern);

      if (match) {
          console.log("Date of Birth found:", match[0]);
      } else {
          console.log("Date of Birth not found in the image.");
      }
  }).catch((error) => {
      console.error("Error during OCR processing:", error);
  });
}

// Example Usage
// For Node.js, replace with a path to a local image file
// For browsers, use the image's URL or a data URI
const imagePath = 'test_image.jpg';
extractDOBFromImage(imagePath);
