import Replicate from "replicate";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";
import { saveImage, writeToFile, Colors } from "./utils.js";

dotenv.config();

const model = new ChatOpenAI({});
const replicate = new Replicate();
const outputParser = new StringOutputParser();

const INSTRUCTIONS =
  "You are an expert in prompt crafting. Use the text input to craft a detailed prompt to create an exceptional marketing campaign about {topic}";
const promptTemplate = PromptTemplate.fromTemplate(INSTRUCTIONS);

// LANGUAGE MODELS
const OPENAI_MODEL = "gpt-3.5-turbo";
const REPLICATE_STABLE_AI =
  "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf";
const ANIMATE_DIFF_MODEL =
  "zsxkib/animate-diff:269a616c8b0c2bbc12fc15fd51bb202b11e94ff0f7786c026aa905305c4ed9fb";

const txt_2_img = async (prompt, callback) => {
  try {
    console.log(Colors.Magenta + "Generating image ..." + Colors.Reset);
    const output = await replicate.run(REPLICATE_STABLE_AI, {
      input: {
        prompt,
        image_dimensions: "512x512",
        num_inference_steps: 12,
        num_outputs: 1,
        guideance_scale: 3.5,
        scheduler: "K_EULER",
      },
    });

    return { output, prompt };
  } catch (error) {
    console.error(Colors.Red + error);
  }
};

// create chain
const chain = promptTemplate.pipe(model)

// run the chain
const response = await chain.invoke({ topic: "national park"})
console.log(response)

