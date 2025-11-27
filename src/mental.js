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
    const cardTemplate = document.getElementById("mentalCardTemplate");
    const mentalCollectionRef = collection(db, "mental");
    const container = document.getElementById("hikes-go-here");

    onSnapshot(mentalCollectionRef, (querySnapshot) => {
        container.innerHTML = ""; // Clear old cards each update

        querySnapshot.forEach((doc) => {
            const mental = doc.data();

            let newcard = cardTemplate.content.cloneNode(true);

            newcard.querySelector("#mentalTitle").textContent = mental.name;
            newcard.querySelector("#description").textContent = mental.description;
            newcard.querySelector("#difficulty").textContent = mental.difficulty;
            newcard.querySelector("#rating").textContent = mental.rating;
            newcard.querySelector("#mentalImg").src = `./images/${mental.code}.png`;
            newcard.querySelector("#pages").href = `mentalPages.html?docID=${doc.id}`;

            container.appendChild(newcard);
        });
    });
}

// Call the function to display cards when the page loads
displayCardsDynamically();

async function addNewMental(event) {
    event.preventDefault();

    // Grab values from the form
    const name = document.getElementById("mentalNameInput").value.trim();
    const description = document.getElementById("mentalDescInput").value.trim();
    const difficulty = document.getElementById("mentalDifficultyInput").value;
    const rating = document.getElementById("mentalRatingInput").value.trim();

    if (!name || !description || !difficulty || !rating) {
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

        alert("✅ Exercise added!");
        document.getElementById("createMentalForm").reset();
    } catch (error) {
        console.error("Error adding workout:", error);
        alert("❌ Failed to add exercise. Check console for details.");
    }
}

// Attach listener
document.getElementById("createMentalForm").addEventListener("submit", addNewMental);