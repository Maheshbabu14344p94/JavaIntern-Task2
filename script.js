const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("todo-list");
const filters = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clear-completed");
const countEl = document.getElementById("task-count");

// Load from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let currentFilter = "all";

// ——— FUNCTIONS ———
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCount() {
  const visible = tasks.filter(t =>
    currentFilter === "all" ||
    (currentFilter === "active" && !t.completed) ||
    (currentFilter === "completed" && t.completed)
  );
  countEl.textContent = `${visible.length} ${visible.length === 1 ? "item" : "items"}`;
}

function render() {
  list.innerHTML = "";
  const filtered = tasks.filter(t =>
    currentFilter === "all" ||
    (currentFilter === "active" && !t.completed) ||
    (currentFilter === "completed" && t.completed)
  );
  filtered.forEach((task, i) => {
    const li = document.createElement("li");
    li.className = `todo-item ${task.completed ? "completed" : ""}`;
    li.innerHTML = `
      <span>${task.text}</span>
      <button class="delete-btn">✖</button>
    `;
    li.querySelector("span").addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      render();
    });
    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks.splice(tasks.indexOf(task), 1);
      saveTasks();
      render();
    });
    list.appendChild(li);
  });
  updateCount();
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false });
  input.value = "";
  saveTasks();
  render();
});

filters.forEach(f => {
  f.addEventListener("click", () => {
    filters.forEach(btn => btn.classList.remove("active"));
    f.classList.add("active");
    currentFilter = f.dataset.filter;
    render();
  });
});

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
});

// ——— CUSTOM CURSOR ———
const cursor = document.getElementById("cursor");
const core = cursor.querySelector(".cursor-core");
const ring = cursor.querySelector(".cursor-ring");

document.addEventListener("mousemove", e => {
  const { clientX: x, clientY: y } = e;
  core.style.left = `${x}px`;
  core.style.top = `${y}px`;
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
});

document.addEventListener("mousedown", () => {
  ring.style.transform = "translate(-50%, -50%) scale(0.8)";
});
document.addEventListener("mouseup", () => {
  ring.style.transform = "translate(-50%, -50%) scale(1)";
});

render();
