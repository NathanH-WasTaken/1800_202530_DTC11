import { auth, db } from "./firebaseConfig.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { deleteUser } from "firebase/auth";
import { deleteDoc } from "firebase/firestore";

const personalInfoFields = document.getElementById("personalInfoFields");
const nameInput = document.getElementById("nameInput");
const heightInput = document.getElementById("heightInput");
const weightInput = document.getElementById("weightInput");
const editButton = document.getElementById("editButton");
const saveButton = document.getElementById("saveButton");

personalInfoFields.disabled = true;

// Load user data
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userDocRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userDocRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    nameInput.value = data.name || "";
    heightInput.value = data.height || "";
    weightInput.value = data.weight || "";
  }
});

editButton.addEventListener("click", () => {
  personalInfoFields.disabled = false;
});

// Save button handler
saveButton.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const updatedData = {
    name: nameInput.value.trim(),
    height: Number(heightInput.value),
    weight: Number(weightInput.value),
  };

  try {
    // Update Firestore
    await updateDoc(doc(db, "users", user.uid), updatedData);

    // Update Firebase Auth displayName
    await updateProfile(user, {
      displayName: nameInput.value.trim(),
    });

    personalInfoFields.disabled = true;
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile.");
  }
});

const deleteAccountButton = document.getElementById("deleteAccountButton");
const logoutButton = document.getElementById("logoutButton");

// Delete account handler
deleteAccountButton.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const confirmation = confirm(
    "Are you sure you want to delete your account? This cannot be undone."
  );

  if (!confirmation) return;

  try {
    await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);
    alert("Your account has been deleted.");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error deleting account:", error);
    alert("Error deleting account. You may need to log in again first.");
  }
});

// Logout button
logoutButton.addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "login.html";
});
