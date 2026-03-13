let wheel;
let mouseX = 0;
let mouseY = 0;
let wheelTabs = [];

let highlightIndex = -1;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function showWheel(tabs) {
  wheelTabs = tabs;

  wheel = document.createElement("div");
  wheel.id = "rw-radial-wheel";

  const step = 360 / tabs.length;

  for (let i = 0; i < tabs.length; i++) {
    const divider = document.createElement("div");
    divider.className = "rw-wheel-divider";

    divider.style.transform = `rotate(${i * step + 90}deg)`;

    wheel.appendChild(divider);
  }

  tabs.forEach((tab, i) => {
    const item = document.createElement("div");
    item.className = "rw-wheel-item";

    const angle = step * i + 180 / tabs.length;
    item.style.transform = `rotate(${angle}deg) translate(160px) rotate(-${angle}deg)`;

    const wrapper = document.createElement("div");
    wrapper.className = "rw-wheel-label-wrapper";

    const label = document.createElement("div");
    label.className = "rw-wheel-label";

    const img = document.createElement("img");
    img.src = tab.favicon || "";

    const span = document.createElement("span");
    span.textContent = tab.title.slice(0, 18);

    label.appendChild(img);
    label.appendChild(span);
    wrapper.appendChild(label);
    item.appendChild(wrapper);

    wheel.appendChild(item);
  });

  const clear = document.createElement("div");
  clear.id = "rw-wheel-clear";
  clear.innerText = "Clear";

  wheel.appendChild(clear);

  document.body.appendChild(wheel);
}

function hideWheel() {
  if (wheel) {
    wheel.remove();
    wheel = null;
  }
}

function getSelectedTab() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  const dx = mouseX - cx;
  const dy = mouseY - cy;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 40) {
    return "CLEAR";
  }

  const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;

  const step = 360 / wheelTabs.length;

  const index = Math.floor(angle / step);

  return wheelTabs[index];
}

function updateHighlight() {
  if (!wheel || wheelTabs.length === 0) return;

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  const dx = mouseX - cx;
  const dy = mouseY - cy;

  const distance = Math.sqrt(dx * dx + dy * dy);

  const items = wheel.querySelectorAll(".rw-wheel-item");

  items.forEach((i) => i.classList.remove("active"));

  if (distance < 40) return;

  const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
  const step = 360 / wheelTabs.length;

  highlightIndex = Math.floor(angle / step);

  if (items[highlightIndex]) {
    items[highlightIndex].classList.add("active");
  }
}
