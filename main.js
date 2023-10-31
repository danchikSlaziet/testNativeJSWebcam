const sendButton = document.querySelector('.send-button');
const loadingPage = document.querySelector('.loading-page');
const videoElement = document.getElementById('camera-stream');
const startCameraFirst = document.getElementById('start-camera-first');
const startCameraButton = document.getElementById('start-camera');
const stopCameraButton = document.getElementById('stop-camera');
const downloadButton = document.getElementById('download-button');
const downloadedImage = document.querySelector('.result-image');
const canvasElement = document.getElementById('canvas');
const hatImage = document.getElementById('hatImage');
const firstPage = document.querySelector('.first-page');
const nextButton = firstPage.querySelector('.first-page__next-button');

const botToken = '4525623';
let userChatId = '';
const photoPath = './images/logo.png';
const apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

let stream;
let hatWidth;
let x;
let y;

function parseQuery(queryString) {
  let query = {};
  let pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

window.addEventListener('DOMContentLoaded', () => {
  let app = window.Telegram.WebApp;
  let query = app.initData;
  let user_data_str = parseQuery(query).user;
  let user_data = JSON.parse(user_data_str)
  app.expand();
  app.ready();
  userChatId = user_data_str.id;
  console.log(user_data_str["id"], user_data["id"])
  console.log(user_data_str, user_data)
});

sendButton.addEventListener('click', () => {

    const canvas = document.createElement('canvas');
    canvas.width = downloadedImage.width; // Ширина вашего изображения
    canvas.height = downloadedImage.height; // Высота вашего изображения
    const ctx = canvas.getContext('2d');
    
    // Нарисуйте изображение на Canvas
    ctx.drawImage(downloadedImage, 0, 0, canvas.width, canvas.height);


    canvas.toBlob(function (blob) {
    // Формируем объект FormData для отправки файла
    const formData = new FormData();
    formData.append('chat_id', userChatId);
    formData.append('photo', blob, 'photo.png');
  
    // Формируем URL для отправки фотографии
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
  
    // Отправка фотографии на сервер Telegram
    fetch(apiUrl, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.ok) {
          console.log('Фотография успешно отправлена в Telegram.');
        } else {
          console.error('Произошла ошибка при отправке фотографии.');
        }
      })
      .catch(error => {
        console.error('Ошибка:', error);
      });
  });
});


startCameraFirst.addEventListener('click', () => {
  nextButton.disabled = false;
  nextButton.classList.remove('button_bg_gray');
});

nextButton.addEventListener('click', () => {
  firstPage.classList.add('first-page_disabled')
})

setTimeout(() => {
  loadingPage.classList.add('loading-page_disabled');
}, 2500);
clearTimeout();

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
startCameraFirst.addEventListener('click', startCamera);
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
  canvasContext.drawImage(hatImage, hatX, hatY, hatWidth, hatHeight);

  // const url = canvasElement.toDataURL('image/png');
  // const a = document.createElement('a');
  // a.href = url;
  // a.download = 'overlayed_image.png';
  // a.click();
  downloadedImage.src = canvasElement.toDataURL('image/png');
  downloadedImage.classList.add('result-image_active');
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