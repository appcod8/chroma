const status = document.getElementById("status");
const resultsDiv = document.getElementById("results");
const qInput = document.getElementById("q");

async function getAIAnswer(query) {
  status.textContent = "Generating answer…";
  
  try {
    const res = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: query })
    });
    const data = await res.json();

    if (data.error) {
      resultsDiv.innerHTML = `Error: ${data.error}`;
    } else {
      resultsDiv.innerHTML = data[0].generated_text;
    }

  } catch (err) {
    resultsDiv.innerHTML = `Error: ${err}`;
  }

  status.textContent = "";
}

function handleSearch() {
  const query = qInput.value.trim();
  if (!query) return;
  getAIAnswer(query);
}

document.getElementById("searchBtn").addEventListener("click", handleSearch);
qInput.addEventListener("keydown", e => { if(e.key==="Enter") handleSearch(); });

