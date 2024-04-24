import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { exec } from "child_process"
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

export default {
  saveImage: async (imageUrl, file_name) => {
    const filePath = path.join(__dirname, "images", `${file_name}`);
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
  },
  readFile: (callback) => {
    fs.readFile("data.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading the file:", err);
        return callback(err);
      }

      try {
        callback(JSON.parse(data));
      } catch (parseErr) {
        console.error("Error parsing JSON:", parseErr);
        return callback(parseErr, null);
      }
    });
  },
  writeToFile: (imageUrl, data) => {
    console.log("Writing to data.json", data);
    data.push({ url: imageUrl });
    fs.writeFile("data.json", JSON.stringify(data, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error writing to the file:", writeErr);
      }
      console.log("Successfully updated data.json");
    });
  },
  convert2Gif: (file_path) => {
    exec("ffmpeg -i " + file_path + ".mp4 -qscale 0 " + file_path + ".gif");
  }
};
