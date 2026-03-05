const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const loadingOverlay = document.getElementById('camera-loading');
const videoContainer = document.getElementById('video-container');

let isGestureControlEnabled = true;
let lastGestureTime = 0;
// We'll expose this wrapper function so UI can attach the game move function
let onGestureDetected = null;

let prevIndexFingerTip = null;
let cooldownMs = 700; 

function onResults(results) {
    // Hide loading
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    if (!videoContainer.classList.contains('active')) {
        videoContainer.classList.add('active');
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
        
    if (isGestureControlEnabled && results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        
        // Draw the hands
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                         {color: '#00FF00', lineWidth: 3});
            drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 1});
        }

        // Gesture Detection using Index Finger Tip (landmark 8)
        const hand = results.multiHandLandmarks[0];
        const indexFingerTip = hand[8];
        
        if (prevIndexFingerTip) {
            const dx = indexFingerTip.x - prevIndexFingerTip.x;
            const dy = indexFingerTip.y - prevIndexFingerTip.y;
            
            // X is mirrored in display, so negative dx is right, positive is left
            const currentTime = Date.now();
            
            // Get sensitivity from slider (1 to 10)
            const sensInput = document.getElementById('sensitivity');
            const sensitivity = sensInput ? parseFloat(sensInput.value) : 5;
            // threshold between 0.05 and 0.15 depending on sensitivity (higher sens = lower threshold)
            const threshold = 0.15 - (sensitivity * 0.01); 

            if (currentTime - lastGestureTime > cooldownMs) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    // Horizontal swipe
                    if (Math.abs(dx) > threshold) {
                        lastGestureTime = currentTime;
                        if (dx > 0) {
                            // Moved right in camera coords -> Physical Left
                            if (onGestureDetected) onGestureDetected('left');
                        } else {
                            // Physical Right
                            if (onGestureDetected) onGestureDetected('right');
                        }
                    }
                } else {
                    // Vertical swipe
                    if (Math.abs(dy) > threshold) {
                        lastGestureTime = currentTime;
                        if (dy > 0) {
                            // Moved down in camera coords -> Physical Down
                            if (onGestureDetected) onGestureDetected('down');
                        } else {
                            // Physical Up
                            if (onGestureDetected) onGestureDetected('up');
                        }
                    }
                }
            }
        }
        
        prevIndexFingerTip = indexFingerTip;
    } else {
        prevIndexFingerTip = null;
    }
    canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults(onResults);

let camera = null;

function startCamera() {
    if (camera) return;
    camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({image: videoElement});
      },
      width: 640,
      height: 480
    });
    camera.start().catch(err => {
        console.error("Camera access denied or failed", err);
        loadingOverlay.innerText = "Camera Access Denied";
    });
}

function stopCamera() {
    if (camera) {
        camera.stop();
        camera = null;
        videoContainer.classList.remove('active');
    }
}

// Start camera by default
startCamera();
