(async function() {
  try {
    const data = await fetch("data.json").then(r => r.json());
    console.log("data loaded:", data);
  } catch (e) {
    console.error("Failed to load data.json:", e);
  }
})();



