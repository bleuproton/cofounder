import anthropic from "@/utils/anthropic.js";
import openai from "@/utils/openai.js";

function resolveLLMProvider() {
        const provider = (process.env.LLM_PROVIDER || "openai").toLowerCase();

        if (provider === "anthropic") return anthropic;
        if (["openai", "custom", "openai-compatible"].includes(provider)) return openai;

        return openai;
}

export default {
        resolveLLMProvider,
};
