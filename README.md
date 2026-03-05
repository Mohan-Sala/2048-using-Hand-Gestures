🎮 2048 Game Using Hand Gestures

An interactive implementation of the classic 2048 puzzle game where the player controls the game using hand gestures instead of a keyboard. The system detects real-time hand movements using computer vision and maps them to game controls, creating a touch-free gaming experience.

This project demonstrates the integration of computer vision and interactive web applications, allowing users to control the game using simple gestures such as left, right, up, and down hand movements captured through a webcam.

🚀 Features

🖐 Hand Gesture Control – Play the 2048 game using hand movements.

🎮 Classic 2048 Gameplay – Merge tiles to reach the 2048 tile.

📷 Real-time Webcam Detection – Uses camera input for gesture recognition.

⚡ Fast and Interactive UI – Smooth game interactions with real-time updates.

🌐 Browser Based – Runs directly in the browser.

🧠 How It Works

The webcam captures live video input.

The system detects the user's hand using computer vision.

Hand gestures are recognized based on finger positions and movement.

Recognized gestures are mapped to game actions:

👆 Up → Move tiles up

👇 Down → Move tiles down

👉 Right → Move tiles right

👈 Left → Move tiles left

The game board updates accordingly.

Hand gesture systems commonly use frameworks like MediaPipe or computer vision models to track hand landmarks and recognize gestures in real time.

🛠 Tech Stack

Frontend

HTML5

CSS3

JavaScript

Computer Vision

Webcam API

Hand Gesture Detection (MediaPipe / OpenCV based concepts)

Game Logic

JavaScript game engine implementation


▶️ How to Run the Project

1️⃣ Clone the Repository
git clone https://github.com/Mohan-Sala/2048-using-Hand-Gestures.git

2️⃣ Navigate to the Project Folder
cd 2048-using-Hand-Gestures

3️⃣ Open the Game

Simply open:

index.html

in your browser.

Allow camera permission when prompted.

🎯 Controls
Gesture	Action
✋ Swipe Up	Move tiles up
✋ Swipe Down	Move tiles down
✋ Swipe Left	Move tiles left
✋ Swipe Right	Move tiles right
💡 Future Improvements

Add gesture training for better accuracy

Implement AI-based gesture classification

Add mobile camera support

Add score leaderboard

Improve gesture detection latency

📚 Learning Outcomes

Through this project, the following concepts were explored:

Computer Vision fundamentals

Hand Gesture Recognition

Real-time interaction using webcam input

Event-driven game development

Frontend UI design

🤝 Contributing

Contributions are welcome!

Fork the repository

Create a new branch

Commit your changes

Open a Pull Request

📄 License

This project is open source and available under the MIT License.

⭐ If you like this project, please consider starring the repository!
