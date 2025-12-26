import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js";

const status = document.getElementById("status");
const resultsDiv = document.getElementById("results");
const qInput = document.getElementById("q");

// Load a larger model in-browser
status.textContent = "Loading AI model…";
const generator = await pipeline("text-generation", "Xenova/gpt-neo-125M");
status.textContent = "AI model Ready…";

async function getAIAnswer(query) {
  resultsDiv.innerHTML = "";
  status.textContent = "AI is typing…";

  try {
    // Prepend a guiding prompt for better answers
    const prompt = "You are a helpful AI assistant. Answer clearly: " + query;

    const output = await generator(prompt, { max_new_tokens: 150 });
    resultsDiv.innerHTML = output[0].generated_text;
  } catch (err) {
    resultsDiv.innerHTML = `Error: ${err}`;
  }

  status.textContent = "";
}

function handleSearch() {
  const query = qInput.value.trim();
  if (!query) return;
  getAIAnswer(query);
}

// Search on button click or Enter
document.getElementById("searchBtn").addEventListener("click", handleSearch);
qInput.addEventListener("keydown", e => { if(e.key === "Enter") handleSearch(); });

//
