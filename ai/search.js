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

const data = await fetch("data.json").then(r => r.json());

function cosine(a, b) {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}

window.search = async function () {
  const q = document.getElementById("q").value;
  const model = await getEmbedder();
  const qVec = (await model(q, { pooling: "mean" })).data;

  const results = data
    .map(d => ({
      text: d.text,
      score: cosine(qVec, d.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  document.getElementById("results").innerHTML =
    results.map(r => `<p>${r.text}</p>`).join("");
};
