import { getAuth } from "firebase/auth";
import { db } from "./firebaseConfig.js";
import { collection, query, where, getDocs, doc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";

const auth = getAuth();

// Get the document ID from the URL
function getDocIdFromUrl() {
    const params = new URL(window.location.href).searchParams;
    return params.get("docID");
}

// Fetch the workout and display its name and image
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
        console.error("Error loading physical workout:", error);
        document.getElementById("physicalName").textContent = "Error loading workout.";
    }
}

displayPhysicalInfo();

function addToCurrent() {
    const btn = document.getElementById("currentBtn");

    btn.addEventListener("click", async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in.");
            return;
        }

        const workoutID = getDocIdFromUrl();
        const workoutRef = doc(db, "physical", workoutID);
        const workoutSnap = await getDoc(workoutRef);

        if (!workoutSnap.exists()) {
            alert("Workout not found.");
            return;
        }

        const data = workoutSnap.data();

        // Create a sub-collection from the document containing each unique user. This sub-collection contains the current exercises the user has.
        await addDoc(collection(db, "users", user.uid, "currentExercises"), {
            name: data.name,
            code: data.code,
            description: data.description,
            difficulty: data.difficulty,
            rating: data.rating,
            addedAt: serverTimestamp()
        });

        alert("✔ Added to Current Exercises!");
    });
}

addToCurrent();