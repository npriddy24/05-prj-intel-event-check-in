// ===== DOM ELEMENTS =====
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const greetingEl = document.getElementById("greeting");
const attendeeCountEl = document.getElementById("attendeeCount");
const progressBarEl = document.getElementById("progressBar");

// Optional (only if you add them to HTML)
const celebrationEl = document.getElementById("celebration");
const attendeeListEl = document.getElementById("attendeeList");

// Team counters by VALUE from <option value="">
const teamCounterEls = {
  water: document.getElementById("waterCount"),
  zero: document.getElementById("zeroCount"),
  power: document.getElementById("powerCount"),
};

// Attendance goal
const GOAL = 50;

// ===== STATE (with localStorage) =====
let totalCount = Number(localStorage.getItem("totalCount")) || 0;

let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  water: 0,
  zero: 0,
  power: 0,
};

let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

// Initial render
updateUI();

// ===== EVENT: FORM SUBMIT =====
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const teamValue = teamSelect.value; // "water", "zero", "power"

  if (!name || !teamValue) return;

  // Increment totals
  totalCount++;
  teamCounts[teamValue]++;

  // Save attendee
  attendees.push({
    name,
    team: teamValue,
  });

  // Persist
  saveProgress();

  // Update UI
  updateUI();

  // Greeting
  const teamLabel = getTeamLabel(teamValue);
  greetingEl.textContent = `Welcome, ${name} from ${teamLabel}!`;

  // Reset form
  form.reset();
  teamSelect.value = ""; // back to "Select Team..."
});

// ===== FUNCTIONS =====

function updateUI() {
  // Total attendance
  attendeeCountEl.textContent = totalCount;

  // Team counts
  for (const key in teamCounts) {
    if (teamCounterEls[key]) {
      teamCounterEls[key].textContent = teamCounts[key];
    }
  }

  // Progress bar
  const percent = Math.min((totalCount / GOAL) * 100, 100);
  progressBarEl.style.width = percent + "%";

  // Optional: attendee list
  if (attendeeListEl) {
    attendeeListEl.innerHTML = "";
    attendees.forEach((a) => {
      const li = document.createElement("li");
      li.textContent = `${a.name} — ${getTeamLabel(a.team)}`;
      attendeeListEl.appendChild(li);
    });
  }

  // Optional: celebration
  if (celebrationEl) {
    if (totalCount >= GOAL) {
      const winningTeam = getWinningTeam();
      celebrationEl.textContent = `🎉 Goal reached! Winning team: ${getTeamLabel(
        winningTeam,
      )}! 🎉`;
    } else {
      celebrationEl.textContent = "";
    }
  }
}

function getTeamLabel(value) {
  switch (value) {
    case "water":
      return "Team Water Wise";
    case "zero":
      return "Team Net Zero";
    case "power":
      return "Team Renewables";
    default:
      return "Unknown Team";
  }
}

function getWinningTeam() {
  let max = -1;
  let winner = null;
  for (const key in teamCounts) {
    if (teamCounts[key] > max) {
      max = teamCounts[key];
      winner = key;
    }
  }
  return winner;
}

function saveProgress() {
  localStorage.setItem("totalCount", totalCount);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}
