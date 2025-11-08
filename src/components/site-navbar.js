import { onAuthStateChanged } from "firebase/auth"

import { auth } from "/src/firebaseConfig.js"
import { logoutUser } from "/src/authentication.js"

class SiteNavbar extends HTMLElement {
  constructor() {
    super()
    this.renderNavbar()
    this.renderAuthControls()
  }

  renderNavbar() {
    this.innerHTML = `
    <!-- Navbar -->
  <div class="hidden sm:block">
    <nav class="bg-gray-500">
      <div class="flex text-[20px]">
        <div class="flex id="healthQuest"">
          <div class="">
            <a href="index.html"> <img src="images/HQLogo.png" class="h-18 w-18" /></a>
          </div>
          <div class="">
            <a href="index.html" class="inline-block hover:bg-gray-600 px-10 py-5"
            ><b>Health Quest</b></a
            >
          </div>
        </div>
        <div class="">
          <a href="mental.html" class="inline-block hover:bg-gray-600 px-10 py-5"
            >Mental</a
          >
        </div>
        <div class="">
          <a href="physical.html" class="inline-block hover:bg-gray-600 px-10 py-5"
            >Physical</a
          >
        </div>
        <div class="ml-auto flex items-center">
        <div id="authControls">
           <!-- populated by function below -->
        </div>
        <a href="" class="inline-block hover:bg-gray-600 px-5 py-3">
          <img src="images/settings.png" class="h-10 w-10" />
        </a>
        </div>
      </div>
    </nav>
  </div>

<!-- Mobile NavBar -->
 <!-- Mobile NavBar -->
<div class="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-500 z-50 h-28">
  <nav class="flex justify-around items-center text-white text-lg">
    <a href="index.html" class="flex flex-col items-center py-5 hover:bg-gray-600 w-full">
      <img src="images/HQLogo.png" class="h-12 w-12 mb-2" />
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
   `
  }

  renderAuthControls() {
    const authControls = this.querySelector("#authControls")
    const healthQuestLink = this.querySelector("#healthQuest")

    onAuthStateChanged(auth, (user) => {
      let updatedAuthControl
      if (user) {
        updatedAuthControl = `<a
          href="#"
          class="inline-block hover:bg-gray-600 px-5 py-3"
          id="signOutBtn"
          >LOG OUT</a
        >`
        // let updatedHealthQuestLink = `
        //   <div class="">
        //     <a href="main.html"> <img src="images/HQLogo.png" class="h-18 w-18" /></a>
        //   </div>
        //   <div class="">
        //     <a href="main.html" class="inline-block hover:bg-gray-600 px-10 py-5"
        //     ><b>Health Quest</b></a
        //     >
        //   </div>
        // `
        authControls.innerHTML = updatedAuthControl
        // healthQuestLink.innerHTML = updatedHealthQuestLink
        const signOutBtn = authControls.querySelector("#signOutBtn")
        signOutBtn.addEventListener("click", logoutUser)
      } else {
        updatedAuthControl = `<a
          href="./login.html"
          class="inline-block hover:bg-gray-600 px-5 py-3"
          id="loginBtn"
          >LOG IN</a
        >`
        authControls.innerHTML = updatedAuthControl
      }
    })
  }
}

customElements.define("site-navbar", SiteNavbar)
