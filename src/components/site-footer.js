class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <footer class="hidden bg-gray-500 lg:flex">
      <div class="basis-4/5">
        <div class="flex mx-10 pt-10 pb-5 px-10 gap-4 items-center">
          <img class="w-15 h-15" src="./images/HQLogo.png" alt="" />
          <h3 class="font-serif font-semibold">Health Quest</h3>
        </div>
        <div class="mx-20">
          <p class="text-justify">
            Our team 11 is developing a health conscious app to help those
            trying to find ways to improve their lifestyle by giving tasks or
            resources in the form of quests with rewards.
          </p>
        </div>
      </div>
      <div class="basis-1/5">
        <ul class="flex flex-col gap-2 m-10">
          <li><a href="#">FAQs</a></li>
          <li><a href="#">Terms & Conditions</a></li>
          <li><a href="#">Contact us</a></li>
        </ul>
      </div>
    </footer>
    `;
  }
}
customElements.define("site-footer", SiteFooter);
