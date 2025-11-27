import { auth, db } from "./firebaseConfig.js";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const leaderboardModal = document.getElementById("leaderboardModal");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const leaderboardClose = document.getElementById("closeLeaderboardBtn");
const leaderboardList = document.getElementById("leaderboardList");
const userRankDisplay = document.getElementById("userRank");

// Show modal
leaderboardBtn.addEventListener("click", () => {
  leaderboardModal.classList.remove("hidden");
  leaderboardModal.classList.add("flex");
  loadLeaderboard();
});

// Close modal
leaderboardClose.addEventListener("click", () => {
  leaderboardModal.classList.add("hidden");
  leaderboardModal.classList.remove("flex");
});

// Close when clicking outside modal content
leaderboardModal.addEventListener("click", (e) => {
  if (e.target === leaderboardModal) {
    leaderboardModal.classList.add("hidden");
    leaderboardModal.classList.remove("flex");
  }
});

async function loadLeaderboard() {
  leaderboardList.innerHTML = `<li class="text-center text-gray-400 py-2">Loading...</li>`;

  const leaderboardQuery = query(
    collection(db, "users"),
    orderBy("level", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(leaderboardQuery);
  const leaderboard = snapshot.docs.map((docSnap) => ({
    uid: docSnap.id,
    ...docSnap.data(),
  }));

  onAuthStateChanged(auth, (user) => {
    if (!user) return;
    displayLeaderboard(leaderboard, user.uid);
  });
}

async function displayLeaderboard(topUsers, currentUserId) {
  leaderboardList.innerHTML = "";

  topUsers.forEach((user, index) => {
    const isCurrent = user.uid === currentUserId;

    leaderboardList.innerHTML += `
      <li class="flex justify-between items-center bg-gray-700 px-4 py-2 rounded-md 
        ${isCurrent ? "border-2 border-yellow-400" : ""}">
        <span class="text-left">${index + 1}. </span>
        <span class="text-center"> ${user.name ?? "Unknown"} </span>
        <span class="text-right w-20">LVL ${String(user.level ?? 1).padStart(
          2,
          "0"
        )}</span>
      </li>
    `;
  });

  await showUserRank(currentUserId);
}

async function showUserRank(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const currentUser = userSnap.data();

  userRankDisplay.textContent = `You are LVL ${currentUser.level ?? 1} with ${
    currentUser.totalCompletions ?? 0
  } completed exercises (${currentUser.currentXP ?? 0} XP)`;
}
