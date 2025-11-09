import { db } from "./firebaseConfig.js";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

// Get the document ID from the URL
function getDocIdFromUrl() {
    const params = new URL(window.location.href).searchParams;
    return params.get("docID");
}

// Fetch the hike and display its name and image
async function displayPhysicalInfo() {
    const id = getDocIdFromUrl();

    try {
        const physicalRef = doc(db, "physical", id);
        const physicalSnap = await getDoc(physicalRef);

        const physical = physicalSnap.data();
        const name = physical.name;
        const code = physical.code;

        // Update the page
        document.getElementById("physicalName").textContent = name;
        const img = document.getElementById("physicalImage");
        img.src = `./images/${code}.png`;
        img.alt = `${name} image`;
    } catch (error) {
        console.error("Error loading hike:", error);
        document.getElementById("physicalName").textContent = "Error loading workout.";
    }
}

displayPhysicalInfo();