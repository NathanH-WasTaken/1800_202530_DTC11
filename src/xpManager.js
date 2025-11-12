import { db } from "./firebaseConfig.js";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export class XPManager {
  constructor(user) {
    this.user = user;
    this.level = 1;
    this.currentXP = 0;
    this.xpToNextLevel = 100;
    this.trackerContainer = document.getElementById("levelTracker");
  }

  async init() {
    const userRef = doc(db, "users", this.user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      this.level = data.level ?? 1;
      this.currentXP = data.currentXP ?? 0;
      this.xpToNextLevel = data.xpToNextLevel ?? 100;
      console.log("Loaded XP data:", data);
    } else {
      console.log("Creating new XP document for user:", this.user.uid);
      await setDoc(userRef, {
        level: this.level,
        currentXP: this.currentXP,
        xpToNextLevel: this.xpToNextLevel,
      });
    }

    this.renderBar();
  }

  renderBar() {
    if (!this.trackerContainer) return;
    this.trackerContainer.innerHTML = `
      <div class="w-full mx-auto text-white text-2xl lg:text-4xl">
        <div class="flex justify-between mb-1">
          <span>Level <span id="levelNumber">${this.level}</span></span>
          <span><span id="currentXP">${
            this.currentXP
          }</span> / <span id="xpNeeded">${this.xpToNextLevel}</span> XP</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-10">
          <div id="xpBar"
            class="bg-green-500 h-10 rounded-full transition-all duration-300"
            style="width: ${(this.currentXP / this.xpToNextLevel) * 100}%">
          </div>
        </div>
      </div>
    `;
  }

  updateBar() {
    const xpBar = document.getElementById("xpBar");
    const levelNumber = document.getElementById("levelNumber");
    const currentXPText = document.getElementById("currentXP");
    const xpNeededText = document.getElementById("xpNeeded");

    if (!xpBar) return;
    xpBar.style.width = `${Math.min(
      (this.currentXP / this.xpToNextLevel) * 100,
      100
    )}%`;
    levelNumber.textContent = this.level;
    currentXPText.textContent = this.currentXP;
    xpNeededText.textContent = this.xpToNextLevel;
  }

  async gainXP(amount) {
    this.currentXP += amount;

    if (this.currentXP >= this.xpToNextLevel) {
      this.currentXP -= this.xpToNextLevel;
      this.level++;
      this.xpToNextLevel = Math.round(this.xpToNextLevel * 1.25);
    }

    this.updateBar();
    await this.save();
  }

  async save() {
    const userRef = doc(db, "users", this.user.uid);
    await updateDoc(userRef, {
      level: this.level,
      currentXP: this.currentXP,
      xpToNextLevel: this.xpToNextLevel,
    });
    console.log("Saved XP:", {
      level: this.level,
      currentXP: this.currentXP,
      xpToNextLevel: this.xpToNextLevel,
    });
  }
}
