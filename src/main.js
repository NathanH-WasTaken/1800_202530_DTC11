import { onAuthReady } from "./authentication"

function showDashboard() {
  const nameElement = document.getElementById("user-name")

  onAuthReady(async (user) => {
    if (!user) {
      location.href = "index.html"
      return
    }

    const name = user.displayName || user.email

    if (nameElement) {
      nameElement.textContent = `${name}!`
    }
  })
}

showDashboard()
