document.getElementById("strategyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const goal = document.getElementById("financialGoal").value;
  const risk = document.getElementById("riskTolerance").value;
  const time = parseInt(document.getElementById("timeHorizon").value);

  let strategy = "";

  if (risk === "low") {
    strategy = "We recommend conservative strategies like government bonds, fixed deposits, or low-risk mutual funds.";
  } else if (risk === "medium") {
    strategy = "You may consider balanced mutual funds, diversified ETFs, and dividend stocks.";
  } else {
    strategy = "Aggressive options like individual stocks, REITs, or growth ETFs may suit your profile.";
  }

  strategy += ` Since your time horizon is ${time} years and your goal is "${goal}", diversification is key.`;

  document.getElementById("strategyText").textContent = strategy;
  document.getElementById("recommendationResult").style.display = "block";
});
