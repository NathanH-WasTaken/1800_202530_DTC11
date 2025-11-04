import {
    onAuthReady
} from "./authentication.js"
import { db } from "./firebaseConfig.js";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

function addPhysicalData() {
    const physicalRef = collection(db, "physical");
    console.log("Adding sample physical workouts data...");
    addDoc(physicalRef, {
        code: "workout01", name: "Pushups", description: "A standard physical exercise to engage your chest, shoulder, and triceps.",
        difficulty: "beginner", rating: "4/5", last_updated: serverTimestamp()
    });
}

async function seedPhysical() {
    const physicalRef = collection(db, "physical");
    const querySnapshot = await getDocs(physicalRef);

    // Check if the collection is empty
    if (querySnapshot.empty) {
        console.log("Physical collection is empty. Seeding data...");
        addPhysicalData();
    } else {
        console.log("Physical collection already contains data. Skipping seed.");
    }
}

// Call the seeding function when the main.html page loads.
seedPhysical();

async function displayCardsDynamically() {
    let cardTemplate = document.getElementById("physicalCardTemplate");
    const physicalCollectionRef = collection(db, "physical");

    try {
        const querySnapshot = await getDocs(physicalCollectionRef);
        querySnapshot.forEach(doc => {
            // Clone the template
            let newcard = cardTemplate.content.cloneNode(true);
            const physical = doc.data(); // Get physical data once

            // Populate the card with workout data
            newcard.querySelector('#workoutTitle').textContent = physical.name;
            newcard.querySelector('#description').textContent = physical.description;
            newcard.querySelector('#difficulty').textContent = physical.difficulty;
            newcard.querySelector('#rating').textContent = physical.rating;

            // 👇 ADD THIS LINE TO SET THE IMAGE SOURCE
            newcard.querySelector('#workoutImg').src = `./images/${physical.code}.png`;

            // Attach the new card to the container
            document.getElementById("hikes-go-here").appendChild(newcard);
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

// Call the function to display cards when the page loads
displayCardsDynamically();