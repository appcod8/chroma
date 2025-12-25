import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers";

let embedder;
async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return embedder;
}

// Load precomputed embeddings
const data = await fetch("data.json").then(r => r.json());

function cosine(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

async function doSearch() {
  const q = document.getElementById("q").value;
  if (!q) return;

  const model = await getEmbedder();
  const qVec = (await model(q, { pooling: "mean" })).data;

  const results = data
    .map(d => ({ text: d.text, score: cosine(qVec, d.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // top 5 results

  document.getElementById("results").innerHTML =
    results.map(r => `<div class="result">${r.text}</div>`).join("");
}

// Button click
document.getElementById("searchBtn").addEventListener("click", doSearch);

// Enter key press
document.getElementById("q").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doSearch();
});

