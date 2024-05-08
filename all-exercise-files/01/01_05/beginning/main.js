import fs from "fs";
import readline from "readline";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Colors from "./colors.js";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const INSTRUCTIONS =
  "You are an expert in prompt crafting. Use the text input to craft a detailed prompt for image generation";
const MODEL = "gpt-3.5-turbo";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function saveImage(imageUrl, file_name) {
  fetch(imageUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      return response.arrayBuffer(); // Added parentheses to call the function
    })
    .then((buffer) => {
      const filePath = path.join(__dirname, "images", `${file_name}.png`);
      fs.writeFile(filePath, Buffer.from(buffer), function (err) {
        if (err) {
          console.error("Error saving file: ", err);
          return;
        }
        console.log("File saved to", filePath);
      });
    })
    .catch((error) => console.error("Error in saveImage function: ", error));
}

async function designPrompt(input) {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: INSTRUCTIONS,
      },
      { role: "user", content: input },
    ],
  });
  console.log({ prompt: completion.choices[0].message.content });
  const file_name = input.split(/[ ,]+/).slice(0, 3).join("_");
  return { prompt: completion.choices[0].message.content, file_name };
}

async function create(prompt, file_name) {
  console.log(Colors.Blue + "Generating image... ");
  // generate image
  const image = await openai.images.generate({ model: "dall-e-3", prompt});

  console.log(image.data[0].url);
  saveImage(image.data[0].url, file_name);
}

async function edit(prompt, file_name) {
  const image = await openai.images.edit({
    image: fs.createReadStream("assets/barrista/original.png"),
    mask: fs.createReadStream("assets/barrista/mask-hair.png"),
    prompt,
  });
  saveImage(image.data[0].url, file_name);
  console.log(image.data);
}

function main() {
  rl.question("prompt: ", async (input) => {
    // design prompt
    const { prompt, file_name } = await designPrompt(input);
    // edit image
    edit(input, file_name);
    rl.close();
  });
}

main();
