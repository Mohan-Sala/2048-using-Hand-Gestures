🎮 2048 Game Using Hand Gestures

An interactive implementation of the classic 2048 puzzle game where the player controls the game using hand gestures instead of keyboard inputs. This project demonstrates how computer vision and web technologies can be combined to create a touch-free gaming experience using a webcam.

The system detects hand movements in real time and maps them to game controls such as left, right, up, and down, allowing players to play the game using natural gestures.

🚀 Features

🖐 Gesture-Based Controls – Play the game using hand movements.

🎮 Classic 2048 Gameplay – Merge tiles to reach the 2048 tile.

📷 Webcam Integration – Detects hand gestures through camera input.

⚡ Real-Time Interaction – Instant response to gesture movements.

🌐 Browser-Based Application – Runs directly in a web browser.

🧠 How It Works

The webcam captures live video input.

The system detects the user's hand in the frame.

Hand movements are analyzed to determine gesture direction.

Each gesture is mapped to a game action:

Gesture	Game Action
👆 Up	Move tiles up
👇 Down	Move tiles down
👉 Right	Move tiles right
👈 Left	Move tiles left

The game board updates dynamically based on the detected gesture.

🛠 Tech Stack

Frontend

HTML5

CSS3

JavaScript

Computer Vision Concepts

Webcam API

Hand Gesture Detection

📂 Project Structure
2048-using-Hand-Gestures
│
├── index.html        # Main game interface
├── style.css         # Game styling
├── game.js           # Core game logic
├── gesture.js        # Hand gesture detection
├── ui.js             # UI rendering and updates
└── README.md         # Project documentation
▶️ How to Run the Project
1️⃣ Clone the Repository
git clone https://github.com/Mohan-Sala/2048-using-Hand-Gestures.git
2️⃣ Navigate to the Project Folder
cd 2048-using-Hand-Gestures
3️⃣ Run the Game

Open index.html in your browser.

Allow camera access when prompted so the system can detect your hand gestures.

🎯 Game Objective

Combine tiles with the same numbers to create the 2048 tile while achieving the highest possible score.

💡 Future Improvements

Improve gesture recognition accuracy

Add mobile gesture support

Add leaderboard and score tracking

Implement AI-based gesture classification

Deploy a live playable demo

📚 Learning Outcomes

This project helped in understanding:

Computer Vision fundamentals

Hand Gesture Recognition

Real-time human–computer interaction

JavaScript game development

Frontend UI design and event handling

🤝 Contributing

Contributions are welcome.

Fork the repository

Create a new branch

Commit your changes

Submit a Pull Request

⭐ Support

If you like this project, consider starring the repository to support the work
