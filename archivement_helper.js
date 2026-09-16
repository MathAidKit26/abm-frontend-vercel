const STORAGE_KEY = "achievements";

const achievements = {
  wau: {
    name: "Wau",
    image: "../assets/wau.png",
  },
  nasi: {
    name: "Nasi",
    image: "../assets/nasi.png",
  },
  n_twin: {
    name: "KLCC",
    image: "../assets/n_twin.png",
  },
  n_tar: {
    name: "Merdeka!",
    image: "../assets/n_tar.png",
  },
  n_bunga: {
    name: "Bunga",
    image: "../assets/n_bunga.png",
  },
  durian: {
    name: "Durian",
    image: "../assets/durian.png",
  },
};

function getUnlocked() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUnlocked(unlocked) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
}

function hasAchievement(id) {
  return getUnlocked().includes(id);
}

function unlockAchievement(id) {
  const achievement = achievements[id];

  if (!achievement) {
    console.warn(`Unknown achievement: ${id}`);
    return false;
  }

  const unlocked = getUnlocked();

  if (unlocked.includes(id)) {
    return false;
  }

  unlocked.push(id);
  saveUnlocked(unlocked);

  const sound = new Audio("../assets/achievement.mp3");
  sound.play();
  toastr.success(
    `<div class="achievement-toast">
    <img
      src="${achievement.image}"
      class="achievement-toast-image"
      alt=""
    />

    <div class="achievement-toast-content">
      <strong>Achievement Unlocked!</strong>
      <span>${achievement.name}</span>
    </div>
  </div>`,
    null,
    {
      closeButton: true,
      progressBar: true,
      escapeHtml: false,
      positionClass: "toast-top-right",
    },
  );

  return true;
}

function resetAchievements() {
  localStorage.removeItem(STORAGE_KEY);
}
