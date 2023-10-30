

const videoElement = document.getElementById('camera-stream');
const startCameraButton = document.getElementById('start-camera');
const stopCameraButton = document.getElementById('stop-camera');
const downloadButton = document.getElementById('download-button');
const downloadedImage = document.getElementById('downloaded-image');
const canvasElement = document.getElementById('canvas');
const hatImage = document.getElementById('hatImage');

let stream;
let hatWidth;
let x;
let y;

// Функция для получения доступа к камере
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    stopCameraButton.disabled = false;
    startCameraButton.disabled = true;  
  } catch (error) {
    console.error('Ошибка при получении доступа к камере:', error);
  }
}

function stopCamera() {
  if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoElement.srcObject = null;
      stopCameraButton.disabled = true;
      startCameraButton.disabled = false;
  }
}

// Назначение обработчиков событий кнопкам
startCameraButton.addEventListener('click', startCamera);
stopCameraButton.addEventListener('click', stopCamera);

// Изначально отключаем кнопку "Выключить камеру"
stopCameraButton.disabled = true;

downloadButton.addEventListener('click', () => {
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;

  const hatAspectRatio = hatImage.width / hatImage.height;
  const hatHeight = hatWidth / hatAspectRatio;

  const canvasContext = canvasElement.getContext('2d');
  canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  const hatX = x;
  const hatY = y;
  console.log(hatX, hatY, hatWidth)
  canvasContext.drawImage(hatImage, hatX, hatY, hatWidth, hatHeight);

  // const url = canvasElement.toDataURL('image/png');
  // const a = document.createElement('a');
  // a.href = url;
  // a.download = 'overlayed_image.png';
  // a.click();
  downloadedImage.src = canvasElement.toDataURL('image/png');
      downloadedImage.classList.add('displayed');
});


  async function startFaceDetection() {
    const MODEL_URL = './models';
    await window.faceapi.loadTinyFaceDetectorModel(MODEL_URL);
    await window.faceapi.loadFaceLandmarkModel(MODEL_URL);
    await window.faceapi.loadFaceRecognitionModel(MODEL_URL);
    await window.faceapi.loadSsdMobilenetv1Model(MODEL_URL);

    const context = canvas.getContext('2d');

    setInterval(async () => {
        const detections = await window.faceapi.detectAllFaces(videoElement).withFaceLandmarks();
        context.clearRect(0, 0, canvas.width, canvas.height);

        detections.forEach((detection) => {
            const landmarks = detection.landmarks;
            const leftEyeBrow = landmarks.getLeftEyeBrow();
            const rightEyeBrow = landmarks.getRightEyeBrow();

            const leftPoint = leftEyeBrow[0];
            const rightPoint = rightEyeBrow.splice(-1)[0];
            const width = (rightPoint.x - leftPoint.x) * 2;

            canvas.width = width;
            hatWidth = width;
            canvas.height = 91;
            canvas.style.width = width + 'px';
            x = (leftPoint.x - width * 0.10) - 10;
            y = (leftEyeBrow[0].y - width * 0.55);
            canvas.style.left = (leftPoint.x - width * 0.10) - 10 + 'px';
            canvas.style.top = (leftEyeBrow[0].y - width * 0.55) + 'px';

            context.drawImage(hatImage, 0, 0, canvas.width, 91);
        });
    }, 10);
  }

  startFaceDetection();