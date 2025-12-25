import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js";

(async function() {
  document.getElementById("status").textContent = "Loading AI model…";

  const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  document.getElementById("status").textContent = "AI model Ready…";

  const data = await fetch("data.json?v=2").then(r => r.json());
  const resultsDiv = document.getElementById("results");

  function doSearch() {
    const q = document.getElementById("q").value.trim();
    if (!q) return resultsDiv.innerHTML = "";

    const qNorm = q.toLowerCase();

    const results = data
      .filter(d => d.text.toLowerCase().includes(qNorm))
      .slice(0,5)
      .map(d => `<div class="result">${d.text.replace(new RegExp(q, 'gi'), m => `<mark>${m}</mark>`)}</div>`);

    resultsDiv.innerHTML = results.join("");
  }

  document.getElementById("searchBtn").addEventListener("click", doSearch);
  document.getElementById("q").addEventListener("keydown", e => { if(e.key==="Enter") doSearch(); });
})();


