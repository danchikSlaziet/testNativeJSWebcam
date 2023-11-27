const sendButton = document.querySelector('.send-button');
const loadingPage = document.querySelector('.loading-page');
const loadingNeuro = document.querySelector('.loading-neuro');
const loadingNeuroBack = loadingNeuro.querySelector('.loading-neuro__back');
const loadingNeuroBtn = loadingNeuro.querySelector('.loading-neuro__button');
const videoElement = document.getElementById('camera-stream');
const startCameraFirst = document.getElementById('start-camera-first');
const startCameraButton = document.getElementById('start-camera');
const stopCameraButton = document.getElementById('stop-camera');
const downloadButton = document.getElementById('download-button');
const downloadedImage = document.querySelector('.result-image');
const canvasElement = document.getElementById('canvas');
const hatImage = document.getElementById('hatImage');
const firstPage = document.querySelector('.first-page');
const firstPageButton = firstPage.querySelector('.first-page__button');
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
const nextButton = document.getElementById('next-button');
const loadingText = document.querySelector('.loading-neuro__text');
const secondPage = document.querySelector('.second-page');
const secondPageBack = secondPage.querySelector('.second-page__back');
const secondPageInput = secondPage.querySelector('.second-page__input');
const secondPagetext = secondPage.querySelector('.second-page__text');
const secondPageButton = secondPage.querySelector('.second-page__button');
const mainPage = document.querySelector('.main-page');
const mainVideo = document.querySelector('.main__video');
const mainPageBack = mainPage.querySelector('.main-page__back');
const mainPageButton = mainPage.querySelector('.main-page__button');
const finalPage = document.querySelector('.final-page');
const finalPageBack = finalPage.querySelector('.final-page__back');
const finalIMG = finalPage.querySelector('.final-page__result-image');
const finalButton = finalPage.querySelector('.final-page__button');
const fourthPage = document.querySelector('.fourth-page');
const fourthPageBack = fourthPage.querySelector('.fourth-page__back');
const fourthPageVideo = fourthPage.querySelector('.fourth-page__button_video');
const fourthPagePhoto = fourthPage.querySelector('.fourth-page__button_photo');
const photoPage = document.querySelector('.photo-page');
const photoContainer = photoPage.querySelector('.photo-container');
const photoToSend = photoPage.querySelector('.photo-to-send');
const photoPageBack = photoPage.querySelector('.photo-page__back');
const photoPageButton = photoPage.querySelector('.photo-page__button');
const photoCap = photoPage.querySelector('.cap');
const messagePage = document.querySelector('.message-page');
const messagePageBack = messagePage.querySelector('.message-page__back');
const messagePageButton = messagePage.querySelector('.message-page__button');

const botToken = '6899155059:AAEaXDEvMiL7qstq_9BFQ59fEXGo-mcF1hU';
let userChatId = '';
const photoPath = './images/logo.png';
const apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

let wasLoading = false;

let detect = new MobileDetect(window.navigator.userAgent);

console.log(detect.os())

if (detect.os() === null) {
  console.log('pc');
  videoContainer.style = `
    left: 50%;
    transform: translateX(-50%);
  `;
}

async function loadModels() {
  const MODEL_URL = './models';
  await window.faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  await window.faceapi.loadFaceLandmarkModel(MODEL_URL);
  await window.faceapi.loadFaceRecognitionModel(MODEL_URL);
  await window.faceapi.loadSsdMobilenetv1Model(MODEL_URL);
}


let stream;
let hatWidth;
let x;
let y;
let staticHatWidth;
let staticX;
let staticY;

let newHatWidth;
let newHatHeight;


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

firstPage.classList.remove('first-page_disabled');


firstPageButton.addEventListener('click', () => {
  startCamera();
  firstPage.classList.add("first-page_disabled");
  secondPage.classList.remove("second-page_disabled");
})

secondPageBack.addEventListener('click', () => {
  secondPage.classList.add('second-page_disabled');
  firstPage.classList.remove('first-page_disabled');
});

loadingNeuroBack.addEventListener('click', () => {
  loadingNeuro.classList.add('loading-neuro_disabled');
  secondPage.classList.remove('second-page_disabled');
  loadingNeuroBtn.style.opacity = '0.2';
});

fourthPageBack.addEventListener('click', () => {
  fourthPage.classList.add('fourth-page_disabled');
  secondPage.classList.remove('second-page_disabled');
});

mainPageBack.addEventListener('click', () => {
  stopCamera();
  mainPage.classList.add('main-page_disabled');
  fourthPage.classList.remove('fourth-page_disabled');
});

messagePageBack.addEventListener('click', () => {
  messagePage.classList.add('message-page_disabled');
  finalPage.classList.add('final-page_active');
  finalButton.textContent = 'Отправить в бота';
});

photoPageBack.addEventListener('click', () => {
  photoPage.classList.add('photo-page_disabled');
  fourthPage.classList.remove('fourth-page_disabled');
  setTimeout(() => {
    attachmentPhoto.src = '';
    photoPageButton.textContent = 'Отправить в бота';
  }, 1000);
});

finalPageBack.addEventListener('click', () => {
  finalPage.classList.remove('final-page_active');
  mainPage.classList.remove('main-page_disabled');
  finalButton.textContent = 'Отправить в бота';
});

secondPageButton.addEventListener('click', () => {
  secondPage.classList.add('second-page_disabled');
  if (wasLoading) {
    secondPage.classList.add('second-page_disabled');
    fourthPage.classList.remove('fourth-page_disabled');
  }
  else {
    loadModels();
    wasLoading = true;
    outNum(100,document.querySelector('.loading-neuro__round'));
    loadingNeuro.classList.remove('loading-neuro_disabled');
  }
});

loadingNeuroBtn.addEventListener('click', () => {
  loadingNeuro.classList.add('loading-neuro_disabled');
  fourthPage.classList.remove('fourth-page_disabled');
});

messagePageButton.addEventListener('click', () => {
  messagePage.classList.add('message-page_disabled');
  mainPage.classList.remove('main-page_disabled');
  finalButton.textContent = 'Отправить в бота';
});

function updateVideoSize() {
  videoElement.width = 640;
  videoElement.height = 480;
}

fourthPageVideo.addEventListener('click', () => {
  if (fourthPageVideo.textContent.trim() === 'сделать фото') {
    if (detect.os() === 'iOS') {
      stopCamera();
    }
    else {
      startCamera();
      mainPage.classList.remove('main-page_disabled');
      fourthPage.classList.add('fourth-page_disabled');
      startFaceVideoDetection(videoElement, canvas);
    }
  }
  else if (fourthPageVideo.textContent.trim() === 'Продолжить') {
    if (detect.os() === 'iOS') {
      startCamera();
      setTimeout(() => {
        videoElement.style.opacity = 1;
      }, 1000)
      startFaceVideoDetection(videoElement, canvas);
      mainVideo.addEventListener('loadedmetadata', (event) => {
        mainVideo.width = 640
        mainVideo.height = 480;
        mainVideo.style.width = "640px";
        mainVideo.style.height = '480px';
        console.log(`main video width: ${mainVideo.width}`)
      });
    }
  }
});

if (detect.os() === 'iOS') {
  videoElement.style.opacity = 0;
}


fourthPagePhoto.addEventListener('change', (event) => {
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
    attachmentPhoto.src = fileReader.result;
    fourthPage.classList.add('fourth-page_disabled');
    photoPage.classList.remove('photo-page_disabled');
    
    startFacePhotoDetection(attachmentPhoto, canvas2);
  }

  fileReader.readAsDataURL(target.files[0]);
})

// Функция для получения доступа к камере
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
    videoElement.srcObject = stream;
    if (!fourthPage.className.includes('disabled')) {
      if (fourthPageVideo.textContent.trim() === 'сделать фото') {
        // fourthPageVideo.textContent = 'Продолжить'
      }
      else {
        fourthPage.classList.add('fourth-page_disabled');
        mainPage.classList.remove('main-page_disabled');
      }
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
      if (detect.os() === 'iOS') {
        fourthPageVideo.textContent = 'Продолжить';
      }
  }
}

const time = 2000;
const step = 1;

function outNum(num, elem) {
  loadingNeuroBack.style = 'pointer-events: none';
  loadingNeuroBack.style.opacity = '.2'
  n = 0;
  let t = Math.round(time/(num/step));
  let interval = setInterval(() => {
      n = n + step;
      if(n == num) {
            clearInterval(interval);
            loadingNeuroBtn.style.opacity = '1';
            loadingNeuroBtn.disabled = false;
            loadingNeuroBack.style = 'pointer-events: all';
            loadingNeuroBack.style.opacity = '1'
       }
  elem.innerHTML = `${n}%`;
  },
t);
};

mainPageButton.addEventListener('click', () => {
  mainPage.classList.add('main-page_disabled');

  const scaleFactor = 2;
  canvasElement.width = videoElement.videoWidth*scaleFactor;
  canvasElement.height = videoElement.videoHeight*scaleFactor;


  const hatAspectRatio = hatImage.width / hatImage.height;
  const hatHeight = hatWidth / hatAspectRatio;

  const canvasContext = canvasElement.getContext('2d');
  canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  const hatX = x;
  const hatY = (y - hatHeight / 2);

  canvasContext.drawImage(hatImage, hatX*scaleFactor, hatY*scaleFactor, hatWidth*scaleFactor, hatHeight*scaleFactor);

  finalIMG.src = canvasElement.toDataURL('image/png', 1);

  finalPage.classList.add('final-page_active');
});

async function sendPhoto(assetElement, place) {
  // Получение ссылки на изображение
  const imageURL = assetElement.src;

  // Загрузка изображения в бинарном формате
  const response = await fetch(imageURL);
  const imageBlob = await response.blob();

  // Формируем объект FormData для отправки файла
  const formData = new FormData();
  formData.append('chat_id', userChatId);
  formData.append('photo', imageBlob, 'photo.jpg');

  // Формируем URL для отправки фотографии
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

  if (place === 'photo') {
    photoPageButton.textContent = 'Отправка...';
  }
  else {
    finalButton.textContent = 'Отправка...';
  }

  // Отправка фотографии на сервер Telegram
  try {
      const result = await fetch(apiUrl, {
          method: 'POST',
          body: formData,
      });
      const data = await result.json();
      console.log(data);
      if (data.ok) {
          console.log('Фотография успешно отправлена в Telegram.');
          if (place === 'photo') {
            photoPageButton.textContent = 'Отправлено';
          }
          else {
            finalButton.textContent = 'Отправлено';
            setTimeout(() => {
              finalPage.classList.remove('final-page_active');
              messagePage.classList.remove('message-page_disabled');
            }, 1000);
          }
      } else {
          console.error('Произошла ошибка при отправке фотографии.');
          if (place === 'photo') {
            photoPageButton.textContent = 'Ошибка';
          }
          else {
            finalButton.textContent = 'Ошибка';
            setTimeout(() => {
              finalPage.classList.remove('final-page_active');
              messagePage.classList.remove('message-page_disabled');
            }, 500);
          }
      }
  } catch (error) {
      console.error('Ошибка:', error);
      if (place === 'photo') {
        photoPageButton.textContent = 'Ошибка';
      }
      else {
        finalButton.textContent = 'Ошибка';
      }
  }
}

finalButton.addEventListener('click', () => sendPhoto(finalIMG, 'video'));
photoPageButton.addEventListener('click', () => sendPhoto(photoToSend, 'photo'));

async function startFaceVideoDetection(assetElement, canvasElement) {
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

          const scaleWidth = (videoElement.videoWidth / document.querySelector('.main__video').offsetWidth);
          const scaleHeight = (videoElement.videoHeight / document.querySelector('.main__video').offsetHeight);
          const leftSmech = (videoElement.videoWidth - document.querySelector('.main__video').offsetWidth)/2;
          const heightSmech = (videoElement.videoHeight - document.querySelector('.main__video').offsetHeight)/2;

          if (detect.os() === null) {
            const width = (rightPoint.x - leftPoint.x) * 2.4;
            hatWidth = width;

            canvasElement.width = width;
            canvasElement.style.width = hatWidth*(1/scaleHeight) + 'px';
            canvasElement.height = hatImage.height * scaleWidth;

            x = leftPoint.x - hatWidth/3.5;
            y = leftEyeBrow[0].y + 25*scaleHeight;

            canvasElement.style.left = (leftPoint.x - hatWidth/3.5) - leftSmech + 'px';
            canvasElement.style.top = ((leftEyeBrow[0].y + 25*scaleHeight) - heightSmech) + 'px';
            context.drawImage(hatImage, 0, 0, canvasElement.width, canvasElement.height);
          }

          else {
            const width = (rightPoint.x - leftPoint.x) * 3;
            hatWidth = width * 0.8;

            canvasElement.width = width;
            canvasElement.style.width = width*(1/scaleHeight) + 'px';
            canvasElement.height = hatImage.height * scaleWidth;

            x = leftPoint.x - hatWidth/3.5;
            y = leftEyeBrow[0].y + 25*scaleHeight;

            canvasElement.style.left = (leftPoint.x - width/5) - leftSmech + 'px';
            canvasElement.style.top = ((leftEyeBrow[0].y + 25*scaleHeight) - heightSmech) + 'px'
            context.drawImage(hatImage, 0, 0, canvasElement.width, canvasElement.height);
          }
      });
  }, 100);
}


async function startFacePhotoDetection(assetElement, canvasElement) {
  const context = canvasElement.getContext('2d');
  const detections = await window.faceapi.detectAllFaces(assetElement).withFaceLandmarks();
  
  context.clearRect(0, 0, canvasElement.width, canvasElement.height);

  detections.forEach((detection) => {
    const landmarks = detection.landmarks;

    // const jawline = landmarks.getJawOutline()
    // const jawLeft = jawline[0]
    // const jawRight = jawline.splice(-1)[0]
    // const adjacent = jawRight.x - jawLeft.x
    // const opposite = jawRight.y - jawLeft.y
    // const angle = Math.atan2(opposite, adjacent) * (180 / Math.PI)

    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    const leftPoint = leftEye[0];
    const rightPoint = rightEye[rightEye.length - 1];
    const width = (rightPoint.x - leftPoint.x) * 4.5;

    const scaleWidth = (attachmentPhoto.width / attachmentPhoto.naturalWidth);
    const scaleHeight = (attachmentPhoto.height / attachmentPhoto.naturalHeight);

    const hatAspectRatio = hatImage.width / hatImage.height;
    const hatHeight = width / hatAspectRatio;

    canvasElement.width = width;
    canvasElement.height = hatHeight;
    canvasElement.style.width = width * scaleWidth + 'px';
    console.log(canvasElement.height);
    staticX = (leftPoint.x * scaleWidth - width * scaleWidth / 3);
    staticY = (leftEye[0].y * scaleHeight + hatHeight * scaleHeight * (2.5 / 100));
    staticHatWidth = width * scaleWidth; 

    canvasElement.style.left = (leftPoint.x * scaleWidth - width * scaleWidth / 3) + 'px';
    canvasElement.style.top = (leftEye[0].y * scaleHeight + hatHeight * scaleHeight * (2.5 / 100)) + 'px';

    context.drawImage(hatImage, 0, 0, canvasElement.width, canvasElement.height);

    const scaleFactor = 4;

    canvasElement3.width = attachmentPhoto.width*scaleFactor;
    canvasElement3.height = attachmentPhoto.height*scaleFactor;
    const canvasContext = canvasElement3.getContext('2d');
    canvasContext.drawImage(attachmentPhoto, 0, 0, canvasElement3.width, canvasElement3.height);
    const hatX = staticX;
    const hatY = staticY;
    const hatAspectRatioN = hatImage.width / hatImage.height;
    const hatHeightN = staticHatWidth / hatAspectRatioN;
    canvasContext.drawImage(hatImage, hatX*scaleFactor, (hatY - hatHeightN/2)*scaleFactor, staticHatWidth*scaleFactor, hatHeightN*scaleFactor);
    canvasElement3.style.opacity = 0;
    photoToSend.src = canvasElement3.toDataURL('image/png');
  });
}