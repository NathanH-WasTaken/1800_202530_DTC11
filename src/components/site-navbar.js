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
