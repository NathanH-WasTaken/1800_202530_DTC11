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

// Buttons and Modal Elements
const deleteAccountButton = document.getElementById("deleteAccountButton");
const deleteModal = document.getElementById("deleteModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");
const logoutButton = document.getElementById("logoutButton");

// Show modal
deleteAccountButton.addEventListener("click", () => {
  deleteModal.classList.remove("hidden");
  deleteModal.classList.add("flex");
});

// Hide modal
cancelDelete.addEventListener("click", () => {
  deleteModal.classList.remove("flex");
  deleteModal.classList.add("hidden");
});

// Click outside modal to close
deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) {
    deleteModal.classList.remove("flex");
    deleteModal.classList.add("hidden");
  }
});

// Confirm deletion
confirmDelete.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await deleteDoc(doc(db, "users", user.uid)); // remove user data
    await deleteUser(user); // remove authentication
    alert("Your account has been deleted.");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error deleting account:", error);
    alert("Error deleting account. Please log in again and retry.");
  }
});

// Logout button
logoutButton.addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "login.html";
});
