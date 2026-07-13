import OpenAI from "openai";

const apiKey = process.env.OPEN_ROUTER_API_KEY ?? process.env.OPENAI_API_KEY;

export const openai = apiKey
  ? new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
    })
  : null;
