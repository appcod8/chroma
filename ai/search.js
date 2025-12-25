import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js";

(async function() {
  const status = document.getElementById("status");
  const resultsDiv = document.getElementById("results");
  const qInput = document.getElementById("q");

  // Load data.json
  const data = await fetch("data.json").then(r => r.json());

  // Quick substring search for instant feedback
  function quickSearch(query) {
    if (!query) return [];
    return data
      .filter(d => d.text.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }

  // Render results
  function render(results) {
    resultsDiv.innerHTML = results.length
      ? results.map(r => `<div class="result">${r.text}</div>`).join("")
      : "No results found";
  }

  // Event for search input
  async function handleSearch() {
    const query = qInput.value.trim();
    render(quickSearch(query)); // immediate results

    if (embedder) {
      // semantic search once model ready
      const qEmb = (await embedder(query))[0];
      const ranked = data
        .map(d => ({ ...d, score: cosineSim(qEmb, d.embedding) }))
        .sort((a,b)=>b.score-a.score)
        .slice(0,5);
      render(ranked);
    }
  }

  // Cosine similarity
  function cosineSim(a,b){
    let dot=0,normA=0,normB=0;
    for(let i=0;i<a.length;i++){ dot+=a[i]*b[i]; normA+=a[i]*a[i]; normB+=b[i]*b[i]; }
    return dot / (Math.sqrt(normA)*Math.sqrt(normB));
  }

  // Event listeners
  document.getElementById("searchBtn").addEventListener("click", handleSearch);
  qInput.addEventListener("keydown", e => { if(e.key==="Enter") handleSearch(); });

  // Load embedding model in background
  status.textContent = "Loading AI model…";
  const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  status.textContent = "AI model Ready…";

})();


