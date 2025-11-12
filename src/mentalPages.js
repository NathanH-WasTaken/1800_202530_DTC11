import { db } from "./firebaseConfig.js";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

// Get the document ID from the URL
function getDocIdFromUrl() {
    const params = new URL(window.location.href).searchParams;
    return params.get("docID");
}

// Fetch the hike and display its name and image
async function displayMentalInfo() {
    const id = getDocIdFromUrl();

    try {
        const mentalRef = doc(db, "mental", id);
        const mentalSnap = await getDoc(mentalRef);

        const mental = mentalSnap.data();
        const name = mental.name;
        const code = mental.code;

        // Update the page
        document.getElementById("mentalName").textContent = name;
        const img = document.getElementById("mentalImage");
        img.src = `./images/${code}.png`;
        img.alt = `${name} image`;
    } catch (error) {
        console.error("Error loading hike:", error);
        document.getElementById("mentalName").textContent = "Error loading workout.";
    }
}

displayMentalInfo();