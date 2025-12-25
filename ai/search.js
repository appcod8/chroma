import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js";

// Load model
const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
document.getElementById("status").textContent = "AI model Ready…";

(async function() {
  const data = await fetch("data.json?v=2").then(r => r.json());

  function doSearch() {
    const q = document.getElementById("q").value.toLowerCase();
    if (!q) return document.getElementById("results").innerHTML = "";

    const results = data
      .filter(d => d.text.toLowerCase().includes(q))
      .slice(0,5)
      .map(d => `<div class="result">${d.text.replace(new RegExp(q, 'gi'), m => `<mark>${m}</mark>`)}</div>`);

    document.getElementById("results").innerHTML = results.join("");
  }

  document.getElementById("searchBtn").addEventListener("click", doSearch);
  document.getElementById("q").addEventListener("keydown", e => { if(e.key==="Enter") doSearch(); });
})();

