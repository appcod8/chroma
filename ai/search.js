// Load precomputed embeddings
const data = await fetch("./data.json").then(r => r.json());

function cosine(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

function doSearch() {
  const q = document.getElementById("q").value;
  if (!q) return;

  // We can't embed the query without a model, so just match exact text or keywords
  const results = data
    .map(d => ({ text: d.text, score: d.text.toLowerCase().includes(q.toLowerCase()) ? 1 : 0 }))
    .sort((a,b) => b.score - a.score)
    .slice(0,5);

  document.getElementById("results").innerHTML =
    results.map(r => `<div class="result">${r.text}</div>`).join("");
}

document.getElementById("searchBtn").addEventListener("click", doSearch);
document.getElementById("q").addEventListener("keydown", e => {
  if(e.key === "Enter") doSearch();
});
