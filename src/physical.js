import {
    onAuthReady
} from "./authentication.js"
import { db } from "./firebaseConfig.js";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const auth = getAuth();

function addPhysicalData() {
    const physicalRef = collection(db, "physical");
    console.log("Adding sample physical workouts data...");
    addDoc(physicalRef, {
        code: "pushups", name: "Pushups", description: "A standard physical exercise to engage your chest, shoulder, and triceps.",
        difficulty: "beginner", rating: "4/5", last_updated: serverTimestamp()
    });

    addDoc(physicalRef, {
        code: "situps", name: "Situps", description: "A standard physical exercise to engage your core.",
        difficulty: "beginner", rating: "2/5", last_updated: serverTimestamp()
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
    const cardTemplate = document.getElementById("physicalCardTemplate");
    const physicalCollectionRef = collection(db, "physical");

    onSnapshot(physicalCollectionRef, (querySnapshot) => {
        const container = document.getElementById("hikes-go-here");
        const filter = document.getElementById("difficultyFilter");

        function showCards(selectedDifficulty) {
            container.innerHTML = ""; // clear old cards

            querySnapshot.forEach((doc) => {
                const physical = doc.data();

                // Filter difficulty
                if (selectedDifficulty !== "all" &&
                    physical.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
                    return;
                }


                // Creating the cards
                let newcard = cardTemplate.content.cloneNode(true);
                newcard.querySelector("#workoutTitle").textContent = physical.name;
                newcard.querySelector("#description").textContent = physical.description;
                newcard.querySelector("#difficulty").textContent = physical.difficulty;
                newcard.querySelector("#rating").textContent = physical.rating;
                newcard.querySelector("#workoutImg").src = `./images/${physical.code}.png`;
                newcard.querySelector("#pages").href = `physicalPages.html?docID=${doc.id}`;
                container.appendChild(newcard);
            });
        }


        showCards(filter.value);


        filter.addEventListener("change", () => {
            showCards(filter.value);
        });
    });
}

// Call the function to display cards when the page loads
displayCardsDynamically();

async function addNewPhysical(event) {
    event.preventDefault();

    // Grab values from the form
    const name = document.getElementById("physicalNameInput").value.trim();
    const description = document.getElementById("physicalDescInput").value.trim();
    const difficulty = document.getElementById("physicalDifficultyInput").value;
    const rating = document.getElementById("physicalRatingInput").value.trim();

    if (!name || !description || !difficulty || !rating) {
        alert("Please fill in all fields.");
        return;
    }

    const code = name.toLowerCase().replace(/\s+/g, "_");

    try {
        const physicalRef = collection(db, "physical");
        await addDoc(physicalRef, {
            name,
            description,
            difficulty,
            rating,
            code,
            last_updated: serverTimestamp()
        });

        alert("✅ Workout added!");
        document.getElementById("createPhysicalForm").reset();
    } catch (error) {
        console.error("Error adding workout:", error);
        alert("❌ Failed to add workout. Check console for details.");
    }
}

// Attach listener
document.getElementById("createPhysicalForm").addEventListener("submit", addNewPhysical);