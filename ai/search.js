import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js";

(async function() {
  const status = document.getElementById("status");
  const resultsDiv = document.getElementById("results");
  const qInput = document.getElementById("q");

  status.textContent = "Loading AI model…";

  // Load embedding model
  const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  status.textContent = "AI model Ready…";

  // Load your precomputed embeddings
  const data = await fetch("data.json").then(r => r.json());

  // Compute cosine similarity
  function cosineSim(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async function doSearch() {
    const query = qInput.value.trim();
    if (!query) return resultsDiv.innerHTML = "";

    // Get embedding for query
    const qEmb = (await embedder(query))[0];

    // Rank by similarity
    const ranked = data
      .map(d => ({ ...d, score: cosineSim(qEmb, d.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Render results with highlight (optional)
    resultsDiv.innerHTML = ranked.map(r => {
      const regex = new RegExp(query, "gi");
      const text = r.text.replace(regex, match => `<mark>${match}</mark>`);
      return `<div class="result">${text}</div>`;
    }).join("");
  }

  document.getElementById("searchBtn").addEventListener("click", doSearch);
  qInput.addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });
})();


