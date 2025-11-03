import { db } from "./firebaseConfig.js"
import { doc, onSnapshot } from "firebase/firestore"
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

function readQuote(day) {
  const quoteDocRef = doc(db, "quotes", day) // Get a reference to the document

  onSnapshot(
    quoteDocRef,
    (docSnap) => {
      // Listen for real-time updates
      if (docSnap.exists()) {
        document.getElementById("quote-goes-here").innerHTML =
          docSnap.data().quote
      } else {
        console.log("No such document!")
      }
    },
    (error) => {
      console.error("Error listening to document: ", error)
    }
  )
}

const dayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]

const today = dayNames[new Date().getDay()]

readQuote(today)
showDashboard()
