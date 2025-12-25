import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers";

const embedder = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2"
);

const data = await fetch("data.json").then(r => r.json());

// Precompute embeddings
for (const item of data) {
  item.embedding = (await embedder(item.text, { pooling: "mean" })).data;
}

function cosine(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

window.search = async function () {
  const q = document.getElementById("q").value;
  const qVec = (await embedder(q, { pooling: "mean" })).data;

  const ranked = data
    .map(d => ({ text: d.text, score: cosine(qVec, d.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  document.getElementById("results").innerHTML =
    ranked.map(r => `<div class="result">${r.text}</div>`).join("");
};
