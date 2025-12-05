# Health Quest
![Health Quest](public/images/HQfullLogo.png)
## Overview

Health Quest is a client-side JavaScript web application that helps users grow and track there health both mentally and physically The app displays a curated list of Physical and Mental excercises each with details such as name,difficulty, and instructions . Users can browse the list and set there prefrences based on the level of difficulty they want to work on.

Developed for the COMP 1800 course, this project applies User-Centred Design practices and agile project management, and demonstrates integration with Firebase backend services for storing user favorites.

---

## Features

- Add and remove exercises from current and past workout lists
- View a personalized list workouts
- Responsive design for desktop and mobile
- Gamified XP and Leveling System that rewards exercise completion
- Timer-based workout tracking with Start, Pause, and Finish controls
- Real-time progress bar showing XP toward the next level
- Leaderboard to compare user levels with others

---

## Technologies Used

Example:

- **Frontend**: HTML, CSS, JavaScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend**: Firebase for hosting
- **Database**: Firestore

---

## Usage

1. Open your browser and visit `http://localhost:3000`.
2. Browse the list of hiking trails displayed on the main page.
3. Click the heart icon (or similar) to mark a trail as a favorite.
4. View your favorite hikes in the favorites section.

---

## Project Structure

```
1800_202530_DTC11/
├── images/
│   ├── boxBreathing.png
│   ├── brain.png
│   ├── brain.svg
│   ├── dumbbell.svg
│   ├── dumbell.png
│   ├── home-icon.svg
│   ├── HQfullLogo.png
│   ├── HQLogo.png
│   ├── HQlogoWhite.png
│   ├── HQtext.png
│   ├── journaling.png
│   ├── leaderboard-star.svg
│   ├── Login.jpg
│   ├── settings.svg
│   ├── NV01.jpg
│   └── videoplayback.mp4
├── src/
│   ├── components/
│   │    ├── site-footer.js
│   │    ├── site-navbar.js
│   ├── authentication.js
|   ├── exerciseTimer.js
│   ├── firebaseConfig.js
│   ├── leaderboard.js
│   ├── loginSignup.js
│   ├── main.js
│   ├── mental.js
│   ├── mentalPages.js
│   ├── physical.js
│   ├── physicalPages.js
│   ├── settings.js
│   └── xpManager.js
│   
├── styles/
│   └── style.css
├── .env
├── .gitignore/
├── index.html
├── login.html
├── main.html
├── mental.html
├── mentalPages.html
├── package-lock.json
├── package.json
├── physical.html
├── physicalPages.html
├── README.md
├── settings.html
├── skeleton.html
├── tailwind.config.js
```

---

## Contributors

- **Nathan Hilario** - BCIT CST Student with a passion for badminton, anime, and valorant. Fun fact: I watched 100+ anime, and read 50+ manga/manhwa.
- **Cedrik** - BCIT CST Student with a passion for outdoor adventures and user-friendly applications. Fun fact: loves photography and has wasted alot of money on diffrent gear.
- **Kyle** - BCIT CST Student with a passion for fishing, camping, gaming, and coding. Fun fact: I love fishing and working on my car.

---

## Acknowledgments

- Code snippets were adapted from resources such as [Firebase API References](https://firebase.google.com/docs/reference/js) and [Tailwind](https://tailwindcss.com/).
- Workout images and icons sourced from free-use resources and licensed media where applicable.
- Thanks to BCIT instructors and classmates for feedback during usability evaluations.

---

## Limitations and Future Work

### Limitations

- Accessibility features can be further improved.
- Level and XP algorithm currently does not adapt to exercise difficulty beyond duration.
- Real-time syncing of exercise progress across multiple devices is not implemented.

### Future Work

- Integrate notifications, daily challenges, and streak rewards.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
