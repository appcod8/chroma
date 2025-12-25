import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js";

// Load model
const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
document.getElementById("status").textContent = "AI model Ready…";

async function doSearch() {
  const q = document.getElementById("q").value;
  if (!q) return;

  // Compute query embedding
  const queryEmbedding = await embedder(q);
  const results = data
    .map(d => ({ 
      text: d.text, 
      score: cosine(queryEmbedding[0][0], d.embedding) 
    }))
    .sort((a,b) => b.score - a.score)
    .slice(0,5);

  document.getElementById("results").innerHTML = results
    .map(r => `<div class="result">${r.text}</div>`).join("");
}

