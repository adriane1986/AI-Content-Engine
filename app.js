const agents = [
  ["Trend Scout", "Finds trucking topics before they peak"],
  ["Market Analyst", "Turns freight data into talking points"],
  ["Script Writer", "Builds hooks, scripts, and CTAs"],
  ["Compliance Guard", "Checks claims and platform rules"],
  ["Stock Curator", "Plans rights-safe footage"],
  ["Voice Director", "Matches narration to the angle"],
  ["Caption Writer", "Creates platform-native captions"],
  ["Thumbnail Lead", "Drafts cover and frame direction"],
  ["SEO Planner", "Titles, tags, hashtags, descriptions"],
  ["Brand Integrator", "Adds RUNVARA naturally"],
  ["Shorts Editor", "Cuts Reels, Shorts, and clips"],
  ["Scheduler", "Queues daily publishing"],
  ["Performance Reader", "Looks for content patterns"],
  ["Refresh Agent", "Regenerates the next month"]
];

const topics = [
  "What new drivers should know before signing with a carrier",
  "How fleets can avoid roadside inspection surprises",
  "Owner-operator math that keeps a truck profitable",
  "Why clean paperwork protects every load",
  "A day in the life of a dispatcher moving freight",
  "How to spot maintenance problems before they cost a week",
  "What brokers notice when a carrier communicates well",
  "The safest way to talk about rates online",
  "How RUNVARA helps trucking teams move with less friction",
  "What makes a driver retention plan actually work",
  "Three compliance habits that save money",
  "How small fleets can look more professional online",
  "What to include in a hiring post for CDL drivers",
  "The difference between busy miles and profitable miles",
  "Why video builds trust faster than a static ad"
];

const scripts = [
  "Hook: Every trucking company says it wants growth, but growth starts with cleaner operations.\n\nVoiceover: Today we break down one habit that protects your loads, your drivers, and your reputation. RUNVARA helps trucking teams turn that discipline into a visible brand story.\n\nCTA: Follow RUNVARA for practical trucking growth content.",
  "Hook: A small paperwork miss can turn into a costly delay.\n\nVoiceover: In this video, we show the checks a fleet should make before the truck leaves the yard. Keep it simple, document it, and make the next load easier to move.\n\nCTA: RUNVARA helps trucking businesses show up professionally every day.",
  "Hook: More miles do not always mean more money.\n\nVoiceover: The smarter question is whether those miles are moving the business forward. We compare deadhead, communication, scheduling, and customer trust in plain trucking terms.\n\nCTA: Save this and follow RUNVARA for more fleet-focused content."
];

const platforms = ["YouTube", "Facebook", "Instagram"];
const statuses = ["draft", "draft", "draft", "approved", "scheduled"];
const state = {
  filter: "all",
  selectedId: 1,
  items: []
};

function makeCalendar() {
  const now = new Date();
  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() + index);
    const topic = topics[index % topics.length];
    return {
      id: index + 1,
      date: date.toISOString(),
      title: topic,
      angle: document.querySelector("#angle-select")?.value || "Owner-operator education",
      voice: document.querySelector("#voice-select")?.value || "Confident industry advisor",
      status: statuses[index % statuses.length],
      platforms: platformSet(index),
      script: scripts[index % scripts.length]
    };
  });
}

function platformSet(index) {
  if (index % 3 === 0) return ["YouTube", "Instagram"];
  if (index % 3 === 1) return ["Facebook", "Instagram"];
  return platforms;
}

function saveState() {
  localStorage.setItem("runvara-content-command", JSON.stringify(state.items));
}

function loadState() {
  const saved = localStorage.getItem("runvara-content-command");
  state.items = saved ? JSON.parse(saved) : makeCalendar();
}

function renderAgents() {
  const grid = document.querySelector("#agent-grid");
  grid.innerHTML = agents.map(([name, role]) => `
    <article class="agent-card">
      <strong>${name}</strong>
      <span>${role}</span>
    </article>
  `).join("");
}

function renderCalendar() {
  const list = document.querySelector("#calendar-list");
  const items = state.filter === "all"
    ? state.items
    : state.items.filter((item) => item.status === state.filter);

  list.innerHTML = items.map((item) => {
    const date = new Date(item.date);
    return `
      <article class="calendar-item ${item.id === state.selectedId ? "is-selected" : ""}" data-id="${item.id}" tabindex="0">
        <div class="date-box">
          <span>${date.toLocaleString("en-US", { month: "short" })}</span>
          <strong>${date.getDate()}</strong>
        </div>
        <div class="calendar-copy">
          <h3>${item.title}</h3>
          <p>${item.angle} · ${item.voice}</p>
          <div class="platform-tags">
            ${item.platforms.map((platform) => `<span class="mini-tag">${platform}</span>`).join("")}
          </div>
        </div>
        <span class="state-tag ${item.status}">${item.status}</span>
      </article>
    `;
  }).join("");
}

function renderSelected() {
  const item = currentItem();
  const selected = document.querySelector("#selected-content");
  if (!item) {
    selected.innerHTML = "<p>No content selected.</p>";
    return;
  }
  selected.innerHTML = `
    <div>
      <span class="state-tag ${item.status}">${item.status}</span>
    </div>
    <h3>${item.title}</h3>
    <div class="platform-tags">
      ${item.platforms.map((platform) => `<span class="mini-tag">${platform}</span>`).join("")}
    </div>
    <div class="script-box">${item.script}</div>
  `;
}

function renderMetrics() {
  const approved = state.items.filter((item) => item.status === "approved").length;
  const scheduled = state.items.filter((item) => item.status === "scheduled").length;
  document.querySelector("#metric-approved").textContent = approved;
  document.querySelector("#metric-scheduled").textContent = scheduled;
  document.querySelector("#metric-compliance").textContent = "100%";
}

function renderAll() {
  renderCalendar();
  renderSelected();
  renderMetrics();
}

function currentItem() {
  return state.items.find((item) => item.id === state.selectedId);
}

function updateItem(id, changes) {
  const index = state.items.findIndex((item) => item.id === id);
  if (index === -1) return;
  state.items[index] = { ...state.items[index], ...changes };
  saveState();
  renderAll();
}

function regenerateItem() {
  const item = currentItem();
  if (!item) return;
  const seed = Math.floor(Math.random() * topics.length);
  updateItem(item.id, {
    title: topics[seed],
    script: scripts[(seed + 1) % scripts.length],
    status: "draft"
  });
  showToast("New trucking content idea generated.");
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function queuePlatform(platform) {
  const approved = state.items.filter((item) => item.status === "approved");
  if (!approved.length) {
    showToast(`Approve at least one post before queuing ${platform}.`);
    return;
  }
  approved.forEach((item) => {
    if (item.platforms.includes(platform)) item.status = "scheduled";
  });
  saveState();
  renderAll();
  showToast(`${platform} publishing queue updated.`);
}

function bindEvents() {
  document.querySelector("#calendar-list").addEventListener("click", (event) => {
    const row = event.target.closest(".calendar-item");
    if (!row) return;
    state.selectedId = Number(row.dataset.id);
    renderAll();
  });

  document.querySelector("#calendar-list").addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const row = event.target.closest(".calendar-item");
    if (!row) return;
    event.preventDefault();
    state.selectedId = Number(row.dataset.id);
    renderAll();
  });

  document.querySelectorAll(".segmented button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".segmented button").forEach((control) => control.classList.remove("is-selected"));
      button.classList.add("is-selected");
      state.filter = button.dataset.filter;
      renderCalendar();
    });
  });

  document.querySelector("#generate-day").addEventListener("click", regenerateItem);
  document.querySelector("#regenerate-script").addEventListener("click", regenerateItem);

  document.querySelector("#refresh-month").addEventListener("click", () => {
    state.items = makeCalendar();
    state.selectedId = 1;
    saveState();
    renderAll();
    showToast("A fresh 30-day calendar is ready.");
  });

  document.querySelector("#approve-script").addEventListener("click", () => {
    const item = currentItem();
    if (!item) return;
    updateItem(item.id, { status: "approved" });
    showToast("Content approved and ready to schedule.");
  });

  document.querySelector("#edit-script").addEventListener("click", () => {
    const item = currentItem();
    if (!item) return;
    document.querySelector("#script-editor").value = item.script;
    document.querySelector("#script-dialog").showModal();
  });

  document.querySelector("#save-script").addEventListener("click", () => {
    const item = currentItem();
    if (!item) return;
    updateItem(item.id, {
      script: document.querySelector("#script-editor").value.trim(),
      status: "draft"
    });
    showToast("Script saved as a draft.");
  });

  document.querySelector("#play-preview").addEventListener("click", () => {
    showToast("Preview plan: stock footage, overlays, voiceover, subtitles, and RUNVARA CTA.");
  });

  document.querySelectorAll("[data-publish]").forEach((button) => {
    button.addEventListener("click", () => queuePlatform(button.dataset.publish));
  });

  ["#angle-select", "#voice-select", "#platform-select"].forEach((selector) => {
    document.querySelector(selector).addEventListener("change", () => {
      showToast("Preference saved for the next generation.");
    });
  });
}

loadState();
renderAgents();
renderAll();
bindEvents();
