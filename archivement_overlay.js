const assets = [
  { id: "wau", src: "../assets/wau.png", name: "Wau" },
  { id: "nasi", src: "../assets/nasi.png", name: "Nasi" },
  { id: "n_twin", src: "../assets/n_twin.png", name: "KLCC" },
  { id: "n_tar", src: "../assets/n_tar.png", name: "Merdeka!" },
  { id: "n_bunga", src: "../assets/n_bunga.png", name: "Bunga" },
  { id: "durian", src: "../assets/durian.png", name: "Durian" },
];

const button = document.createElement("button");
button.className = "archivement";
button.style.backgroundColor = "transparent";
button.style.borderColor = "transparent";
document.body.appendChild(button);

const unlocked = JSON.parse(localStorage.getItem("achievements") || "[]");

function createOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "achievement-overlay";

  const modal = document.createElement("div");
  modal.className = "achievement-modal";

  const title = document.createElement("h2");
  title.textContent = "Achievements";

  const grid = document.createElement("div");
  grid.className = "achievement-grid";

  assets.forEach((asset, index) => {
    const item = document.createElement("div");
    item.className = "achievement-item";

    const image = document.createElement("img");
    image.src = asset.src;
    image.alt = asset.name;

    const isUnlocked = unlocked.includes(asset.id);

    if (!isUnlocked) {
      image.classList.add("locked");
      item.classList.add("locked");
    }

    const name = document.createElement("span");
    name.textContent = isUnlocked ? asset.name : "???";

    item.append(image, name);
    grid.appendChild(item);
  });

  modal.append(title, grid);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      overlay.remove();
    }
  });
}

let clickCount = 0;
let clickTimer = null;

button.addEventListener("click", () => {
  clickCount++;

  // Clear existing timer on each click
  if (clickTimer) {
    clearTimeout(clickTimer);
  }

  // If clicked 5 times, reset achievements
  if (clickCount === 3) {
    if (confirm("Clear all achievements?")) {
      localStorage.removeItem("achievements");
    }
    location.reload();
  }

  // Reset count if user stops clicking for more than 1.5 seconds
  clickTimer = setTimeout(() => {
    clickCount = 0;
  }, 1500);

  // Still open the overlay normally on single clicks
  createOverlay();
});
