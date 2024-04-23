import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
const port = process.env.PORT || 4000;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const INSTRUCTIONS =
  "You are an expert in prompt crafting. Use the text input to craft a detailed prompt for Image generation";
const MODEL = "gpt-3.5-turbo";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const readFile = (callback) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return callback(err, null);
    }
    try {
      callback(null, JSON.parse(data));
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      return callback(parseErr, null);
    }
  });
};

const writeToFile = (url) => {
  // Read the existing file
  readFile((err, data) => {
    if (err) {
      return console.error(err);
    }
    if (!Array.isArray(data)) {
      return callback(new Error("The file does not contain an array."));
    }

    data.push({ url });
    console.log("data", data);
    fs.writeFile("data.json", JSON.stringify(data, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error writing to the file:", writeErr);
      }
      console.log("Successfully updated data.json");
    });
  });
};

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
  return completion.choices[0].message.content;
}

async function create(req, res) {
  const prompt = await designPrompt(req.body.input);
  const image = await openai.images.generate({
    prompt,
    model: "dall-e-3",
  });

  console.log("image generated!", image.data[0]);
  writeToFile(image.data[0].url, req.body.input);
  return res.status(200).send({
    image: image.data[0].url,
  });
}

async function read(_, res) {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      return console.error(err);
    }
    return res.status(200).send({
      images: JSON.parse(data),
    });
  });
}

// Endpoints
app.post("/create", create);
app.get("/", read);

app.listen(port, () => console.log(`Server is running on port ${port}!!`));
