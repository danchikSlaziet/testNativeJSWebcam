const sendButton = document.querySelector('.send-button');
const loadingPage = document.querySelector('.loading-page');
const loadingNeuro = document.querySelector('.loading-neuro');
const videoElement = document.getElementById('camera-stream');
const startCameraFirst = document.getElementById('start-camera-first');
const startCameraButton = document.getElementById('start-camera');
const stopCameraButton = document.getElementById('stop-camera');
const downloadButton = document.getElementById('download-button');
const downloadedImage = document.querySelector('.result-image');
const canvasElement = document.getElementById('canvas');
const hatImage = document.getElementById('hatImage');
const firstPage = document.querySelector('.first-page');
const videoContainer = document.querySelector('.main__video-container');
const resultImage = document.querySelector('.result-image');
const attachmentPhoto = document.querySelector('.attachment-photo');
const sendAttachButton = document.querySelector('.send-attach-button');
const inputPhoto = document.querySelector('.attach-photo-button');
const maskButton = document.querySelector('.mask-button');
const canvasElement2 = document.getElementById('canvas2');
const canvasElement3 = document.getElementById('canvas3');
const newPhoto = document.getElementById('new-photo');
const screenButton = document.querySelector('.screen-button');

const botToken = '6899155059:AAEaXDEvMiL7qstq_9BFQ59fEXGo-mcF1hU';
let userChatId = '';
const photoPath = './images/logo.png';
const apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

let detect = new MobileDetect(window.navigator.userAgent);

console.log(detect.os())

if (detect.os() === null) {
  console.log('pc');
  videoContainer.style = `
    left: 50%;
    transform: translateX(-50%);
  `;
  resultImage.style = `
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  `;
}

let stream;
let hatWidth;
let x;
let y;
let staticHatWidth;
let staticX;
let staticY;

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
  userChatId = user_data["id"];
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

setTimeout(() => {
  loadingPage.classList.add('loading-page_disabled');
}, 2500);
clearTimeout();

// Функция для получения доступа к камере
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
    videoElement.srcObject = stream;
    stopCameraButton.disabled = false;
    startCameraButton.disabled = true;
    if (!firstPage.className.includes('disabled')) {
      firstPage.classList.add('first-page_disabled');
      loadingNeuro.classList.remove('loading-neuro_disabled');
      if (detect.os() === 'iOS') {
        stopCamera();
        startCamera();
        console.log('iOS')
      }
      setTimeout(() => {
        loadingNeuro.classList.add('loading-neuro_disabled');
      }, 2500);
      clearTimeout();
    }
    console.log('доступ к камере дан')
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
startCameraFirst.addEventListener('click', () => {
  startCamera();
});
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
  canvasContext.drawImage(hatImage, hatX, hatY, hatWidth, hatHeight);

  downloadedImage.src = canvasElement.toDataURL('image/png');
  downloadedImage.classList.add('result-image_active');
});

inputPhoto.onchange = function(event) {
  canvasElement3.style.opacity = 0;
  var target = event.target;

  if (!FileReader) {
      alert('FileReader не поддерживается — облом');
      return;
  }

  if (!target.files.length) {
      alert('Ничего не загружено');
      return;
  }

  var fileReader = new FileReader();
  fileReader.onload = function() {
    attachmentPhoto.classList.add('attachment-photo_active');
    attachmentPhoto.src = fileReader.result;
  }

  fileReader.readAsDataURL(target.files[0]);
}

maskButton.addEventListener('click', () => {
  startFacePhotoDetection(attachmentPhoto, canvas2);
});

sendAttachButton.addEventListener('click', () => {
  // canvasElement3.width = attachmentPhoto.width;
  // canvasElement3.height = attachmentPhoto.height;

  // const hatAspectRatio = hatImage.width / hatImage.height;
  // const hatHeight = staticHatWidth / hatAspectRatio;

  // const canvasContext = canvasElement3.getContext('2d');
  // canvasContext.drawImage(attachmentPhoto, 0, 0, canvasElement3.width, canvasElement3.height);
  // const hatX = staticX;
  // const hatY = staticY;
  // canvasContext.drawImage(hatImage, hatX - 4, hatY, staticHatWidth, hatHeight);
  // attachmentPhoto.src = canvasElement3.toDataURL('image/png');



  const canvas = document.createElement('canvas');
    canvas.width = attachmentPhoto.width; // Ширина вашего изображения
    canvas.height = attachmentPhoto.height; // Высота вашего изображения
    const ctx = canvas.getContext('2d');
    
    // Нарисуйте изображение на Canvas
    ctx.drawImage(attachmentPhoto, 0, 0, canvas.width, canvas.height);


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

async function startFaceVideoDetection(assetElement, canvasElement) {
  const MODEL_URL = './models';
  await window.faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  await window.faceapi.loadFaceLandmarkModel(MODEL_URL);
  await window.faceapi.loadFaceRecognitionModel(MODEL_URL);
  await window.faceapi.loadSsdMobilenetv1Model(MODEL_URL);

  const context = canvasElement.getContext('2d');

  setInterval(async () => {
      const detections = await window.faceapi.detectAllFaces(assetElement).withFaceLandmarks();
      context.clearRect(0, 0, canvasElement.width, canvasElement.height);

      detections.forEach((detection) => {
          const landmarks = detection.landmarks;
          const leftEyeBrow = landmarks.getLeftEyeBrow();
          const rightEyeBrow = landmarks.getRightEyeBrow();

          const leftPoint = leftEyeBrow[0];
          const rightPoint = rightEyeBrow.splice(-1)[0];
          const width = (rightPoint.x - leftPoint.x) * 2;

          canvasElement.width = width;
          hatWidth = width;
          canvasElement.height = 91;
          canvasElement.style.width = width + 'px';
          x = (leftPoint.x - width * 0.10) - 10;
          y = (leftEyeBrow[0].y - width * 0.55);
          canvasElement.style.left = (leftPoint.x - width * 0.10) - 10 + 'px';
          canvasElement.style.top = (leftEyeBrow[0].y - width * 0.55) + 'px';

          context.drawImage(hatImage, 0, 0, canvasElement.width, 91);
      });
  }, 10);
}

async function startFacePhotoDetection(assetElement, canvasElement) {
  const MODEL_URL = './models';
  await window.faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  await window.faceapi.loadFaceLandmarkModel(MODEL_URL);
  await window.faceapi.loadFaceRecognitionModel(MODEL_URL);
  await window.faceapi.loadSsdMobilenetv1Model(MODEL_URL);

  const context = canvasElement.getContext('2d');

  const detections = await window.faceapi.detectAllFaces(assetElement).withFaceLandmarks();
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    detections.forEach((detection) => {
        const landmarks = detection.landmarks;
        const leftEyeBrow = landmarks.getLeftEyeBrow();
        const rightEyeBrow = landmarks.getRightEyeBrow();

        const leftPoint = leftEyeBrow[0];
        const rightPoint = rightEyeBrow.splice(-1)[0];
        const width = (rightPoint.x - leftPoint.x) * 2;

        canvasElement.width = width;
        staticHatWidth = width;
        canvasElement.height = 91;
        canvasElement.style.width = width + 'px';
        staticX = (leftPoint.x - width * 0.10);
        staticY = (leftEyeBrow[0].y - width * 0.55);
        canvasElement.style.left = (leftPoint.x - width * 0.10) - 4 + 'px';
        canvasElement.style.top = (leftEyeBrow[0].y - width * 0.55) + 'px';

        context.drawImage(hatImage, 0, 0, canvasElement.width, 91);
    });

  canvasElement3.width = attachmentPhoto.width;
  canvasElement3.height = attachmentPhoto.height;

  const hatAspectRatio = hatImage.width / hatImage.height;
  const hatHeight = staticHatWidth / hatAspectRatio;

  const canvasContext = canvasElement3.getContext('2d');
  canvasContext.drawImage(attachmentPhoto, 0, 0, canvasElement3.width, canvasElement3.height);
  const hatX = staticX;
  const hatY = staticY;
  canvasContext.drawImage(hatImage, hatX - 4, hatY, staticHatWidth, hatHeight);
  attachmentPhoto.src = canvasElement3.toDataURL('image/png');
  canvasElement3.style.opacity = 1;
}

startFaceVideoDetection(videoElement, canvas);