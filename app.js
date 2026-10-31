
const games = [
  {
    id: 1,
    league: "Premier League",
    status: "UPCOMING",
    time: "Today · 18:30",
    home: "North London FC",
    away: "Manchester Reds",
    score: "",
    odds: [2.15, 3.25, 3.10]
  },
  {
    id: 2,
    league: "Premier League",
    status: "LIVE",
    time: "LIVE · 62′",
    home: "Liverpool Town",
    away: "Brighton Athletic",
    score: "2 : 1",
    odds: [1.42, 4.10, 6.50]
  },
  {
    id: 3,
    league: "Premier League",
    status: "UPCOMING",
    time: "Today · 21:00",
    home: "Chelsea Blue",
    away: "Newcastle United",
    score: "",
    odds: [1.95, 3.50, 3.65]
  },
  {
    id: 4,
    league: "Premier League",
    status: "UPCOMING",
    time: "Tomorrow · 16:00",
    home: "Aston Villa",
    away: "West Ham City",
    score: "",
    odds: [1.88, 3.40, 3.90]
  },
  {
    id: 5,
    league: "Premier League",
    status: "UPCOMING",
    time: "Tomorrow · 19:30",
    home: "Everton FC",
    away: "Crystal Palace",
    score: "",
    odds: [2.55, 3.05, 2.85]
  }
];

const labels = ["1", "X", "2"];

let selections = [];
let filter = "all";

const matchesEl = document.getElementById("matches");
const slipEl = document.getElementById("slipItems");
const stakeEl = document.getElementById("stake");

function renderMatches() {
  const q = document.getElementById("search").value.toLowerCase();

  const visible = games.filter(g =>
    (filter === "all" ||
      (filter === "live" && g.status === "LIVE") ||
      (filter === "upcoming" && g.status === "UPCOMING")) &&
    (`${g.home} ${g.away} ${g.league}`.toLowerCase().includes(q))
  );

  matchesEl.innerHTML = visible.length
    ? visible.map(g => `
      <article class="match">
        <div class="match-meta">
          <span>${g.league}</span>
          <span class="${g.status === "LIVE" ? "live-dot" : ""}">
            ${g.time}
          </span>
        </div>

        <div class="match-body">
          <div class="teams">
            <div class="team">
              ${g.home}
              <span class="team-score">
                ${g.score ? g.score.split(" : ")[0] : ""}
              </span>
            </div>

            <div class="team">
              ${g.away}
              <span class="team-score">
                ${g.score ? g.score.split(" : ")[1] : ""}
              </span>
            </div>
          </div>

          <div class="markets">
            ${g.odds.map((odd, i) => {
              const selected = selections.some(
                s => s.gameId === g.id && s.outcome === labels[i]
              );

              return `
                <button
                  class="odd ${selected ? "chosen" : ""}"
                  data-game="${g.id}"
                  data-outcome="${labels[i]}"
                  data-odd="${odd}"
                >
                  <span>${labels[i]}</span>
                  <strong>${odd.toFixed(2)}</strong>
                </button>
              `;
            }).join("")}
          </div>
        </div>
      </article>
    `).join("")
    : `<div class="empty-matches">
         No matching fixtures. Try another search.
       </div>`;
}

function renderSlip() {
  document.getElementById("selectionCount").textContent =
    `${selections.length} selection${selections.length === 1 ? "" : "s"}`;

  slipEl.innerHTML = selections.length
    ? selections.map(s => `
      <div class="slip-item">
        <button
          class="remove"
          data-remove="${s.gameId}"
          aria-label="Remove selection"
        >×</button>

        <strong>${s.home} v ${s.away}</strong>

        <small>
          ${s.outcome === "1"
            ? s.home
            : s.outcome === "2"
              ? s.away
              : "Draw"}
          · ${s.outcome} @ ${s.odd.toFixed(2)}
        </small>
      </div>
    `).join("")
    : `<div class="empty">Your selections will appear here.</div>`;

  const combined = selections.reduce((a, s) => a * s.odd, 1);

  const stake = Math.max(0, Number(stakeEl.value) || 0);

  document.getElementById("combinedOdds").textContent =
    selections.length ? combined.toFixed(2) : "—";

  document.getElementById("potentialReturn").textContent =
    `KSh ${(stake * combined).toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  document.getElementById("placeBet").disabled =
    !selections.length || stake <= 0;
}

matchesEl.addEventListener("click", e => {
  const b = e.target.closest(".odd");

  if (!b) return;

  const id = Number(b.dataset.game);
  const outcome = b.dataset.outcome;

  const game = games.find(g => g.id === id);

  selections = selections.filter(s => s.gameId !== id);

  selections.push({
    gameId: id,
    outcome,
    odd: Number(b.dataset.odd),
    home: game.home,
    away: game.away
  });

  renderMatches();
  renderSlip();
});

slipEl.addEventListener("click", e => {
  const b = e.target.closest("[data-remove]");

  if (!b) return;

  selections = selections.filter(
    s => s.gameId !== Number(b.dataset.remove)
  );

  renderMatches();
  renderSlip();
});

document.querySelectorAll(".tab").forEach(b => {
  b.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(x =>
      x.classList.remove("selected")
    );

    b.classList.add("selected");

    filter = b.dataset.filter;

    renderMatches();
  });
});

document.getElementById("search").addEventListener(
  "input",
  renderMatches
);

stakeEl.addEventListener("input", renderSlip);

function toast(message) {
  const el = document.getElementById("toast");

  el.textContent = message;
  el.classList.add("show");

  setTimeout(() => el.classList.remove("show"), 2600);
}

document.getElementById("placeBet").addEventListener("click", () => {
  toast("Demo only: no real bet has been placed.");
});

document.getElementById("loginBtn").addEventListener("click", () => {
  toast("Demo account sign-in is not enabled yet.");
});

document.getElementById("joinBtn").addEventListener("click", () => {
  toast("Registration is not enabled in this demo.");
});

renderMatches();
renderSlip();
