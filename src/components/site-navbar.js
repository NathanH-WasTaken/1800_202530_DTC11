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
    this.innerHTML = /*html*/ `
    <!-- Large Screen Navbar -->
    <nav class="bg-white shadow dark:bg-gray-800">
      <div class="flex items-center justify-between py-6 mx-10 text-gray-600 dark:text-gray-300">
        <!-- Logo -->
        <div class="flex items-center space-x-4" id="healthQuest">
          <a href="index.html">
            <img src="images/HQlogoWhite.png" class="h-16 w-16" alt="Health Quest Logo" />
          </a>
          <a href="index.html" class="text-xl font-bold">Health Quest</a>
        </div>

        <!-- Links -->
        <div class="hidden lg:flex space-x-6 text-[18px] capitalize">
          <a href="mental.html" class="rounded-lg px-8 py-1 hover:text-gray-200 hover:bg-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105">
            Mental
          </a>
          <a href="physical.html" class="rounded-lg px-8 py-1 hover:text-gray-200 hover:bg-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105">
            Physical
          </a>
        </div>

        <!-- Auth + Settings -->
        <div class="flex items-center space-x-4">
          <div id="authControls" class="hidden lg:flex"></div>
          <a href="settings.html" class="hidden lg:inline-block hover:text-gray-800 dark:hover:text-gray-200">
            <img src="images/settings.svg" class="h-8 w-8" alt="Settings" />
          </a>
        </div>
      </div>
    </nav>

    <!-- Mobile NavBar -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-500 z-50 h-26 text-black">
      <nav class="flex justify-around items-center text-sm sm:text-lg">
        <a href="main.html" class="flex flex-col items-center py-5 hover:bg-gray-600 flex-1">
          <img src="images/home-icon.svg" class="h-10 w-10 mb-1" />
          <span>Home</span>
        </a>
        <a href="mental.html" class="flex flex-col items-center py-5 hover:bg-gray-600 flex-1">
          <img src="images/brain.svg" class="h-10 w-10 mb-1" />
          <span>Mental</span>
        </a>
        <a href="physical.html" class="flex flex-col items-center py-5 hover:bg-gray-600 flex-1">
          <img src="images/dumbbell.svg" class="h-10 w-10 mb-1" />
          <span>Physical</span>
        </a>
        <a href="settings.html" class="flex flex-col items-center py-5 hover:bg-gray-600 flex-1">
          <img src="images/settings.svg" class="h-10 w-10 mb-1" />
          <span>Settings</span>
        </a>
      </nav>
    </div>
    `;
  }

  renderAuthControls() {
    const authControls = this.querySelector("#authControls");
    const healthQuestLinks = this.querySelectorAll("#healthQuest a");
    const settingsButtons = this.querySelectorAll('a[href="settings.html"]');

    onAuthStateChanged(auth, (user) => {
      let updatedAuthControl;
      if (user) {
        updatedAuthControl = `
          <a href="#" class="inline-block hover:bg-gray-600 px-5 py-3" id="signOutBtn">LOG OUT</a>
        `;
        authControls.innerHTML = updatedAuthControl;

        const signOutBtn = authControls.querySelector("#signOutBtn");
        signOutBtn.addEventListener("click", logoutUser);

        // Redirect logo/brand links to main.html when logged in
        healthQuestLinks.forEach((link) => {
          link.setAttribute("href", "main.html");
        });
        settingsButtons.forEach((btn) =>
          btn.setAttribute("href", "settings.html")
        );
      } else {
        updatedAuthControl = `
          <a href="./login.html" class="inline-block hover:bg-gray-600 px-5 py-3" id="loginBtn">LOG IN</a>
        `;
        authControls.innerHTML = updatedAuthControl;
        settingsButtons.forEach((btn) =>
          btn.setAttribute("href", "login.html")
        );
      }
    });
  }
}

customElements.define("site-navbar", SiteNavbar);
