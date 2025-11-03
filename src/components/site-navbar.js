class SiteNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <!-- Navbar -->
    <nav class="bg-gray-500">
      <div class="flex text-[20px]">
        <div class="">
          <a href="index.html"> <img src="images/HQLogo.png" class="h-18 w-18" /></a>
        </div>
        <div class="">
          <a href="index.html" class="inline-block hover:bg-gray-600 px-10 py-5"
            ><b>Health Quest</b></a
          >
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
          <a
            href="./login.html"
            class="inline-block hover:bg-gray-600 px-5 py-3"
            >LOG IN</a
          >
          <a href="" class="inline-block hover:bg-gray-600 px-5 py-3">
            <img src="images/settings.png" class="h-10 w-10" />
          </a>
        </div>
      </div>
    </nav>
    `
  }
}

customElements.define("site-navbar", SiteNavbar)
