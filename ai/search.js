// Fetch precomputed embeddings
const data = await fetch("./data.json?v=2").then(r => r.json());

// Cosine similarity (optional if you later want semantic score)
function cosine(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

// Perform search
function doSearch() {
  const q = document.getElementById("q").value.trim().toLowerCase();
  const resultsDiv = document.getElementById("results");
  if (!q) {
    resultsDiv.innerHTML = "";
    return;
  }

  // Simple match: highlight query in text
  const results = data
    .map(d => {
      const score = d.text.toLowerCase().includes(q) ? 1 : 0;
      const highlighted = d.text.replace(new RegExp(q, 'gi'), match => `<mark>${match}</mark>`);
      return { text: highlighted, score };
    })
    .sort((a,b) => b.score - a.score)
    .slice(0,5); // top 5

  resultsDiv.innerHTML = results.map(r => `<div class="result">${r.text}</div>`).join("");
}

// Button click
document.getElementById("searchBtn").addEventListener("click", doSearch);

// Enter key
document.getElementById("q").addEventListener("keydown", e => {
  if (e.key === "Enter") doSearch();
});

// Optional: live search as you type
document.getElementById("q").addEventListener("input", doSearch);
