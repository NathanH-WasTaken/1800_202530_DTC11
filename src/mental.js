import {
    onAuthReady
} from "./authentication.js"
import { db } from "./firebaseConfig.js";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const auth = getAuth();

function addMentalData() {
    const mentalRef = collection(db, "mental");
    console.log("Adding sample mental workouts data...");
    addDoc(mentalRef, {
        code: "meditation", name: "Meditation", description: "A calm way to relax your body",
        difficulty: "beginner", rating: "4/5", last_updated: serverTimestamp()
    });

    addDoc(mentalRef, {
        code: "boxBreathing", name: "Box Breathing", description: "A way to decrease your heart rate by controlling your breathing",
        difficulty: "beginner", rating: "5/5", last_updated: serverTimestamp()
    });

    addDoc(mentalRef, {
        code: "journaling", name: "Journaling", description: "A way to express your thoughts and feelings on paper",
        difficulty: "beginner", rating: "3/5", last_updated: serverTimestamp()
    });
}

async function seedMental() {
    const mentalRef = collection(db, "mental");
    const querySnapshot = await getDocs(mentalRef);

    // Check if the collection is empty
    if (querySnapshot.empty) {
        console.log("Mental collection is empty. Seeding data...");
        addMentalData();
    } else {
        console.log("Mental collection already contains data. Skipping seed.");
    }
}

// Call the seeding function when the main.html page loads.
seedMental();

async function displayCardsDynamically() {
    let cardTemplate = document.getElementById("mentalCardTemplate");
    const mentalCollectionRef = collection(db, "mental");

    try {
        const querySnapshot = await getDocs(mentalCollectionRef);
        querySnapshot.forEach(doc => {
            // Clone the templatee
            let newcard = cardTemplate.content.cloneNode(true);
            const mental = doc.data(); // Get mental data once

            // Populate the card with mental data
            newcard.querySelector('#mentalTitle').textContent = mental.name;
            newcard.querySelector('#description').textContent = mental.description;
            newcard.querySelector('#difficulty').textContent = mental.difficulty;
            newcard.querySelector('#rating').textContent = mental.rating;
            newcard.querySelector("#pages").href = `mentalPages.html?docID=${doc.id}`;

            //  ADD THIS LINE TO SET THE IMAGE SOURCE
            newcard.querySelector('#mentalImg').src = `./images/${mental.code}.png`;

            // Attach the new card to the container
            document.getElementById("hikes-go-here").appendChild(newcard);
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

// Call the function to display cards when the page loads
displayCardsDynamically();

async function addNewMental(event) {
    event.preventDefault();

    // Grab values from the form
    const name = document.getElementById("mentalNameInput").value.trim();
    const description = document.getElementById("mentalDescInput").value.trim();
    const length = document.getElementById("mentalLengthInput").value;
    const rating = document.getElementById("mentalRatingInput").value.trim();

    if (!name || !description || !length || !rating) {
        alert("Please fill in all fields.");
        return;
    }

    const code = name.toLowerCase().replace(/\s+/g, "_");
    try {
        const mentalRef = collection(db, "mental");
        await addDoc(mentalRef, {
            name,
            description,
            difficulty,
            rating,
            code,
            last_updated: serverTimestamp()
        });

        alert("✅ Exercise added! (Refresh page)");
        document.getElementById("createMentalForm").reset();
    } catch (error) {
        console.error("Error adding workout:", error);
        alert("❌ Failed to add exercise. Check console for details.");
    }
}

// Attach listener
document.getElementById("createMentalForm").addEventListener("submit", addNewMental);