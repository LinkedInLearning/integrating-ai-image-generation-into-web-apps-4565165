import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const Colors = {
  Black: "\u001b[30m",
  Red: "\u001b[31m",
  Green: " \u001b[32m",
  Yellow: "\u001b[33m",
  Blue: "\u001b[34m",
  Magenta: "\u001b[35m",
  Cyan: "\u001b[36m",
  White: "\u001b[37m",
  Reset: "\u001b[0m",
};

export const saveImage = async (imageUrl) => {
  const filePath = path.join(__dirname, "campaigns", "image.png");
  fetch(imageUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      return response.arrayBuffer(); // Added parentheses to call the function
    })
    .then((buffer) => {
      fs.writeFile(filePath, Buffer.from(buffer), function (err) {
        if (err) {
          console.error("Error saving file: ", err);
          return;
        }
        console.log("File saved to", filePath);
      });
    })
    .catch((error) => console.error("Error in saveImage function: ", error));
};
export const writeToFile = (text) => {
  const wrappedText = (s) =>
    text.replace(/(?![^\n]{1,32}$)([^\n]{1,32})\s/g, "$1\n");

  fs.writeFile("campaigns/text.txt", wrappedText, (writeErr) => {
    if (writeErr) {
      console.error("Error writing to the file:", writeErr);
    }
    console.log("Successfully updated data.json");
  });
};
