import { AOPlace, atlasObscura } from "atlas-obscura-api";
import fs from "fs";

const placeId = 46288;

async function main() {
  try {
    const place: AOPlace = await atlasObscura.placeFull(placeId);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${place.title}</title>
        <style>
          body {
            font-family: sans-serif;
            background: #f9f9f9;
            padding: 40px;
          }
          h1 {
            color: #333;
          }
        </style>
      </head>
      <body>
        <h1>${place.title}</h1>
        <p><a href="${place.url}" target="_blank">Open on Atlas Obscura</a></p>
      </body>
      </html>
    `;

    fs.writeFileSync("output.html", html);
    console.log(`✅ File output.html was created with title: ${place.title}`);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main();
