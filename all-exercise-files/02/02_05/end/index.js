import OpenAI from "openai";
import Replicate from "replicate";
import readline from "readline";
import dotenv from "dotenv";
import utils from "./utils.js";

import { Colors } from "./utils.js";
const { saveImage, writeToFile, readFile } = utils;
dotenv.config();

const openai = new OpenAI();
const MODEL = "gpt-3.5-turbo";
const INSTRUCTIONS =
  "You are an expert in prompt crafting. Use the text input to craft a detailed prompt for Image generation";

const STABLE_DIFFUSION_MODEL =
  "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4";
const STABLE_DIFFUSION_IMG_2_IMG =
  "stability-ai/stable-diffusion-img2img:15a3689ee13b0d2616e98820eca31d4c3abcd36672df6afce5cb6feb1d66087d";
const ANIMATE_DIFF_MODEL =
  "zsxkib/animate-diff:269a616c8b0c2bbc12fc15fd51bb202b11e94ff0f7786c026aa905305c4ed9fb";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
  const file_name = input.split(/[ ,]+/).join("_");

  return { prompt: completion.choices[0].message.content, file_name };
}

const replicateAPI = {
  txt_2_img: async (prompt, callback) => {
    try {
      console.log(Colors.Magenta + "Generating image ..." + Colors.Reset);
      // run the model 

      const input = {
        prompt,
        scheduler: "K_EULER"
      };
    
      const output = await replicate.run(STABLE_DIFFUSION_MODEL, { input });
      callback(output[0])

    } catch (error) {
      console.error(Colors.Red + error);
    }
  },
  img_2_img: async (image_url, callback) => {
    try {
      console.log(Colors.Magenta + "Generating image ..." + Colors.Reset);
       // run the model 
       const input = {
        image: image_url,
        num_inference_steps: 25
    };
    
      const output = await replicate.run(STABLE_DIFFUSION_IMG_2_IMG, { input });
      callback(output[0])
    } catch (error) {
      console.error(Colors.Red + error);
    }
  },
  txt_2_animation: async (prompt, callback) => {
    try {
      console.log(Colors.Magenta + "Generating image ..." + Colors.Reset);
       // run the model 
    } catch (error) {
      console.error(Colors.Red + error);
    }
  },
};

function main() {
  console.log(
    "\n\n============================================================"
  );
  console.log("==== *** IMAGE GENERATION with Stable Diffusion 🖼️ 🎨 *** ====");
  console.log("============================================================");
  rl.question(
    Colors.Yellow + "\nGenerate an image from image: " + Colors.Reset,
    async (input) => {
      // ask the GPT model to generate a prompt
      const { prompt, file_name } = await designPrompt(input);
      // generate the image

      // replicateAPI.txt_2_img(prompt, async (output) => { 
      //   readFile(data => {
      //     writeToFile(output, data)
      //     saveImage(output, file_name + ".png")
      //   })
      // })

      replicateAPI.img_2_img(input, async (output) => { 
        readFile(data => {
          writeToFile(output, data)
          saveImage(output, new Date().getMilliseconds() + ".png")
        })
      })
      rl.close();
    }
  );
}
main();
