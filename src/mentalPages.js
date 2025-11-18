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
        console.error("Error loading Mental workout:", error);
        document.getElementById("mentalName").textContent = "Error loading workout.";
    }
}

displayMentalInfo();

function addToCurrent() {
    const btn = document.getElementById("currentBtn");

    btn.addEventListener("click", async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in.");
            return;
        }

        const workoutID = getDocIdFromUrl();
        const workoutRef = doc(db, "mental", workoutID);
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