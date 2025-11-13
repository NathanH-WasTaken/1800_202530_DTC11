import { onAuthStateChanged } from "firebase/auth";

import { auth } from "/src/firebaseConfig.js";
import { logoutUser } from "/src/authentication.js";

class SiteNavbar extends HTMLElement {
  constructor() {
    super();
    this.renderNavbar();
    this.renderAuthControls();
  }

  renderNavbar() {
    this.innerHTML = `
    <!-- Large ScreenNavbar -->
  <!-- Unified Health Quest Navigation -->
<nav class="bg-white shadow dark:bg-gray-800">
  <div class="container flex items-center justify-between p-6 mx-auto text-gray-600 dark:text-gray-300">

    <!-- Logo and Brand -->
    <div class="flex items-center space-x-4" id="healthQuest">
      <a href="index.html">
        <img src="images/HQlogoWhite.png" class="h-16 w-16" alt="Health Quest Logo" />
      </a>
      <a href="index.html" class="text-xl font-bold ">
        Health Quest
      </a>
    </div>

    <!-- Navigation Links -->
    <div class="hidden lg:flex space-x-6 text-[18px] capitalize">
      <a href="mental.html" class="rounded-lg border-3 px-8 py-1 hover:text-gray-200 hover:bg-blue-600
      transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-160">
        Mental
      </a>
      <a href="physical.html" class="rounded-lg border-3 px-8 py-1 hover:text-gray-200 hover:bg-blue-600
      transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-160">
        Physical
      </a>
    </div>
    <div class="flex items-center space-x-4">
      <div id="authControls">
        <!-- populated by function below -->
      </div>
      <a href="#" class="hidden lg:inline-block hover:text-gray-800 dark:hover:text-gray-200">
        <img src="images/settings.png" class="h-8 w-8" alt="Settings" />
      </a>
    </div>
  </div>
</nav>



 <!-- Mobile NavBar -->
<div class="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-300 z-50 h-28 text-black">
  <nav class="flex justify-around items-cent text-lg">
    <a href="main.html" class="flex flex-col items-center py-5 hover:bg-gray-600 w-full">
      <img src="images/home-icon.svg" class="h-12 w-12 mb-2" />
      <span>Home</span>
    </a>
    <a href="mental.html" class="flex flex-col items-center py-5 hover:bg-gray-600 w-full">
      <img src="images/brain.png" class="h-12 w-12 mb-2" />
      <span>Mental</span>
    </a>
    <a href="physical.html" class="flex flex-col items-center py-5 hover:bg-gray-600 w-full">
      <img src="images/dumbell.png" class="h-12 w-12 mb-2" />
      <span>Physical</span>
    </a>
    <a href="settings.html" class="flex flex-col items-center py-5 hover:bg-gray-600 w-full">
      <img src="images/settings.png" class="h-12 w-12 mb-2" />
      <span>Settings</span>
    </a>
  </nav>
</div>
   `;
  }

  renderAuthControls() {
    const authControls = this.querySelector("#authControls");
    const healthQuestLinks = this.querySelectorAll("#healthQuest a");

    onAuthStateChanged(auth, (user) => {
      let updatedAuthControl;
      if (user) {
        updatedAuthControl = `<a
          href="#"
          class="inline-block hover:bg-gray-600 px-5 py-3"
          id="signOutBtn"
          >LOG OUT</a
        >`;
        authControls.innerHTML = updatedAuthControl;
        // healthQuestLink.innerHTML = updatedHealthQuestLink
        const signOutBtn = authControls.querySelector("#signOutBtn");
        signOutBtn.addEventListener("click", logoutUser);

        healthQuestLinks.forEach((link) => {
          link.setAttribute("href", "main.html");
        });
      } else {
        updatedAuthControl = `<a
          href="./login.html"
          class="inline-block hover:bg-gray-600 px-5 py-3"
          id="loginBtn"
          >LOG IN</a
        >`;
        authControls.innerHTML = updatedAuthControl;
      }
    });
  }
}

customElements.define("site-navbar", SiteNavbar);
