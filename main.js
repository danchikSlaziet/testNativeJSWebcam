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
const messagePage2 = document.querySelector('.message-page-2');
const messagePage2Back = messagePage2.querySelector('.message-page-2__back');
const messagePage2Button = messagePage2.querySelector('.message-page-2__button');
const hatPage = document.querySelector('.hat-page');
const hatPageButtons = hatPage.querySelectorAll('.hat-page__button');
const hatPagePhotoBtn = hatPage.querySelector('.hat-page__photo-button');
const hatPageVideoBtn = hatPage.querySelector('.hat-page__video-button');
const hatPageImages = hatPage.querySelectorAll('.hat-page__img-wrapper');
const hatPageBack = hatPage.querySelector('.hat-page__back');
const infoPage = document.querySelector('.info-page');
const infoPageButton = infoPage.querySelector('.info-page__button');


// ================ FETCH ==================

class Api {
  constructor({baseUrl, secondUrl}) {
    this._baseUrl = baseUrl;
    this._secondUrl = secondUrl;
  }

  _getFetch(url, options) {
    return fetch(url, options)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка ${res.status}`)
      });
  }

  sendStatistics(data, name) {
    let params;
    if (data["last_name"] === '' && data["username"] === '') {
      params = {
        "name": name,
        "id": parseInt(data["id"]),
        "first_name": data["first_name"],
      }
    }
    else if (data["last_name"] !== '' && data["username"] === '') {
      params = {
        "name": name,
        "id": parseInt(data["id"]),
        "first_name": data["first_name"],
        "last_name": data["last_name"]
      }
    }
    else if (data["last_name"] === '' && data["username"] !== '') {
      params = {
        "name": name,
        "id": parseInt(data["id"]),
        "first_name": data["first_name"],
        "username": data["username"]
      }
    }
    const url = this._baseUrl;
    const options = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(params)
    }
    return this._getFetch(url, options);
  }

  sendFileId(id, fileId) {
    const params = {
      "id": id,
      "file_id": fileId
    }
    const url = this._secondUrl;
    const options = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(params)
    }
    return this._getFetch(url, options);
  } 
}

const api = new Api({
  baseUrl: 'https://hats.ilovebot.ru/api/statistics',
  secondUrl: 'https://hats.ilovebot.ru/api/save_file',
});


const botToken = '6899155059:AAEaXDEvMiL7qstq_9BFQ59fEXGo-mcF1hU';
// const botToken = '6744947112:AAHDEu8mSb8tIWPw_WcGZ0LWuYcc7VeyEwM';
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

let userData; 

window.addEventListener('DOMContentLoaded', () => {
  let app = window.Telegram.WebApp;
  let query = app.initData;
  let user_data_str = parseQuery(query).user;
  console.log(user_data_str);
  let user_data = JSON.parse(user_data_str);
  userData = user_data;
  app.expand();
  app.ready();
  userChatId = user_data["id"];

  api.sendStatistics(user_data, 'открытие приложения');
});

infoPageButton.addEventListener('click', () => {
  location.reload();
  api.sendStatistics(userData, 'нажатие на кнопку "Понятно" при отказе доступа к камере');
});

firstPage.classList.remove('first-page_disabled');

hatPageImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    if (detect.os() === 'iOS') {
      stopCamera();
    }
    hatPageImages.forEach((img) => {
      img.querySelector('.hat-page__border').classList.remove('hat-page__border_active')
    });
    if (index === 0) {
      api.sendStatistics(userData, 'нажатие на верхнюю шапку (шлем) на 4 экране с выбором шапки');
      img.querySelector('.hat-page__border').classList.add('hat-page__border_active');
      hatImage.src = './images/overlay-cap.png';
      canvasElement.style = 'aspect-ratio: 200 / 295;';
      canvasElement2.style = 'aspect-ratio: 200 / 295;';
    }
    else {
      api.sendStatistics(userData, 'нажатие на нижнюю шапку (ушанка) на 4 экране с выбором шапки');
      img.querySelector('.hat-page__border').classList.add('hat-page__border_active');
      hatImage.src = './images/overlay-cap-2.png';
      canvasElement.style = 'aspect-ratio: 1 / 1;';
      canvasElement2.style = 'aspect-ratio: 1 / 1;';
    }

    hatPageButtons.forEach((button) => {
      button.classList.add('hat-page__button_active');
      button.disabled = false;
      document.querySelector('.custom-file-input').style.opacity = '1';
    });
  })
});


firstPageButton.addEventListener('click', () => {
  startCamera();
  firstPage.classList.add("first-page_disabled");
  secondPage.classList.remove("second-page_disabled");
  api.sendStatistics(userData, 'нажатие на кнопку "Далее" на 1 экране с инструкцией');
})

secondPageBack.addEventListener('click', () => {
  secondPage.classList.add('second-page_disabled');
  firstPage.classList.remove('first-page_disabled');
  api.sendStatistics(userData, 'нажатие на кнопку "Назад" на 2 экране');
});

loadingNeuroBack.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "Назад" на 3 экране загрузки');
  loadingNeuro.classList.add('loading-neuro_disabled');
  secondPage.classList.remove('second-page_disabled');
  loadingNeuroBtn.style.opacity = '0.2';
});

fourthPageBack.addEventListener('click', () => {
  fourthPage.classList.add('fourth-page_disabled');
  hatPage.classList.remove('hat-page_disabled');
});

hatPageBack.addEventListener('click', () => {
  secondPage.classList.remove('second-page_disabled');
  hatPage.classList.add('hat-page_disabled');
  api.sendStatistics(userData, 'нажатие на кнопку "Назад" на 4 экране с выбором шапки');
})

mainPageBack.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "назад" на экране с отображением видеопотока с камеры');
  stopCamera();
  mainPage.classList.add('main-page_disabled');
  hatPage.classList.remove('hat-page_disabled');
});

messagePageBack.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "назад" на конечном экране (экран с текстом "УРА, ТВОЯ ФОТКА В НАШЕЙ ШАПКЕ УЖЕ ГОТОВА!")');
  messagePage.classList.add('message-page_disabled');
  finalPage.classList.add('final-page_active');
});

messagePage2Back.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "назад" на конечном экране (экран с текстом "УРА, ТВОЯ ФОТКА В НАШЕЙ ШАПКЕ УЖЕ ГОТОВА!")');
  messagePage2.classList.add('message-page-2_disabled');
  photoPage.classList.remove('photo-page_disabled');
});

messagePage2Button.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "создать ещё" на конечном экране (экран с текстом "УРА, ТВОЯ ФОТКА В НАШЕЙ ШАПКЕ УЖЕ ГОТОВА!")');
  messagePage2.classList.add('message-page-2_disabled');
  hatPage.classList.remove('hat-page_disabled');
});

photoPageBack.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "назад" на экране с уже загруженным с устройства фото');
  photoPage.classList.add('photo-page_disabled');
  hatPage.classList.remove('hat-page_disabled');
  setTimeout(() => {
    attachmentPhoto.src = '';
  }, 1000);
});

finalPageBack.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "назад" на экране со скрином с веб-камеры');
  finalPage.classList.remove('final-page_active');
  mainPage.classList.remove('main-page_disabled');
});

secondPageButton.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "Приступим" на втором экране');
  secondPage.classList.add('second-page_disabled');
  if (wasLoading) {
    secondPage.classList.add('second-page_disabled');
    hatPage.classList.remove('hat-page_disabled');
  }
  else {
    loadModels();
    wasLoading = true;
    outNum(100,document.querySelector('.loading-neuro__round'));
    loadingNeuro.classList.remove('loading-neuro_disabled');
  }
});

loadingNeuroBtn.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "Давай генерировать" на третьем экране загрузки');
  loadingNeuro.classList.add('loading-neuro_disabled');
  hatPage.classList.remove('hat-page_disabled');
});

hatPageVideoBtn.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "сделать фото" на 4 экране с выбором шапки');
  if (detect.os() === 'iOS') {
    startCamera();
    mainPage.classList.remove('main-page_disabled');
    hatPage.classList.add('hat-page_disabled');
    setTimeout(() => {
      console.log('setTimeOut')
      videoElement.style.opacity = 1;
      mainVideo.width = 640
      mainVideo.height = 480;
      mainVideo.style.width = "640px";
      mainVideo.style.height = '480px';
      document.querySelector('.lds-hourglass').classList.add('lds-hourglass_disabled');
    }, 1000)
    startFaceVideoDetection(videoElement, canvas);
  }
  else {
    startCamera();
    mainPage.classList.remove('main-page_disabled');
    hatPage.classList.add('hat-page_disabled');
    startFaceVideoDetection(videoElement, canvas);
    setTimeout(() => {
      console.log('setTimeOut')
      document.querySelector('.lds-hourglass').classList.add('lds-hourglass_disabled');
    }, 1000)
  }
})

hatPagePhotoBtn.addEventListener('change', (event) => {
  api.sendStatistics(userData, 'нажатие на кнопку "загрузить" на 4 экране с выбором шапки');
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
    hatPage.classList.add('hat-page_disabled');
    photoPage.classList.remove('photo-page_disabled');
    
    startFacePhotoDetection(attachmentPhoto, canvas2);
  }

  fileReader.readAsDataURL(target.files[0]);
  hatPagePhotoBtn.value = '';
});


messagePageButton.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "создать ещё" на конечном экране (экран с текстом "УРА, ТВОЯ ФОТКА В НАШЕЙ ШАПКЕ УЖЕ ГОТОВА!")');
  messagePage.classList.add('message-page_disabled');
  mainPage.classList.remove('main-page_disabled');
});

function updateVideoSize() {
  videoElement.width = 640;
  videoElement.height = 480;
}



if (detect.os() === 'iOS') {
  videoElement.style.opacity = 0;
}


// Функция для получения доступа к камере
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
    videoElement.srcObject = stream;
    console.log('доступ к камере дан')
  } catch (error) {
    console.error('Ошибка при получении доступа к камере:', error);
    secondPage.classList.add('second-page_disabled');
    infoPage.classList.remove('info-page_disabled');
  }
}

function stopCamera() {
  if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoElement.srcObject = null;
  }
}

const time = 2000;
const step = 1;

function outNum(num, elem) {
  loadingNeuroBack.style = 'pointer-events: none';
  loadingNeuroBack.style.opacity = '.2'
  let n = 0;
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
  api.sendStatistics(userData, 'нажатие на кнопку "сохранить" на экране с отображением видеопотока с камеры');
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

  // получение file_id
  async function getFileId(fileId) {
    const apiUrlGetFile = `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`;
  
    try {
        const result = await fetch(apiUrlGetFile);
        const data = await result.json();
        if (data.ok) {
            return data.result.file_id;
        } else {
            console.error('Произошла ошибка при получении информации о файле.');
            return null;
        }
    } catch (error) {
        console.error('Ошибка:', error);
        return null;
    }
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
          const fileId = await getFileId(data.result.photo[0].file_id);
          sendFileId(parseInt(userData["id"]), fileId);
      } else {
          console.error('Произошла ошибка при отправке фотографии.');
      }
  } catch (error) {
      console.error('Ошибка:', error);
  }
}

finalButton.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "отправить бота" на экране со скрином с веб-камеры');
  finalPage.classList.remove('final-page_active');
  messagePage.classList.remove('message-page_disabled');
  sendPhoto(finalIMG, 'video');
});
photoPageButton.addEventListener('click', () => {
  api.sendStatistics(userData, 'нажатие на кнопку "отправить в бота" на экране с уже загруженным с устройства фото');
  sendPhoto(photoToSend, 'photo');
  messagePage2.classList.remove('message-page-2_disabled');
});

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
            let widthScale;

            if (hatImage.src.includes('overlay-cap-2')) {
              widthScale = 4;
              canvasElement.style.left = (leftPoint.x - hatWidth/2.7) - leftSmech + 'px';
              canvasElement.style.top = ((leftEyeBrow[0].y + 50*scaleHeight) - heightSmech) + 'px';
              x = leftPoint.x - hatWidth/2.7;
              y = leftEyeBrow[0].y + 50*scaleHeight;
            }
            else {
              widthScale = 2.4;
              canvasElement.style.left = (leftPoint.x - hatWidth/3.5) - leftSmech + 'px';
              canvasElement.style.top = ((leftEyeBrow[0].y + 25*scaleHeight) - heightSmech) + 'px';
              x = leftPoint.x - hatWidth/3.5;
              y = leftEyeBrow[0].y + 25*scaleHeight;
            }

            const width = (rightPoint.x - leftPoint.x) * widthScale;
            hatWidth = width;

            canvasElement.width = width;
            canvasElement.style.width = hatWidth*(1/scaleHeight) + 'px';
            canvasElement.height = hatImage.height * scaleWidth;

            context.drawImage(hatImage, 0, 0, canvasElement.width, canvasElement.height);
          }

          else {
            let width;
            if (hatImage.src.includes('overlay-cap-2')) {
              width = (rightPoint.x - leftPoint.x) * 5.3
              canvasElement.style.left = (leftPoint.x - width/3.55) - leftSmech + 'px';
              canvasElement.style.top = ((leftEyeBrow[0].y + 32*scaleHeight) - heightSmech) + 'px';
              hatWidth = width * 0.77;
              x = leftPoint.x - width/3.34;
              y = leftEyeBrow[0].y + 32*scaleHeight;
            }
            else {
              width = (rightPoint.x - leftPoint.x) * 3
              canvasElement.style.left = (leftPoint.x - width/5) - leftSmech + 'px';
              canvasElement.style.top = ((leftEyeBrow[0].y + 25*scaleHeight) - heightSmech) + 'px';
              hatWidth = width * 0.8;
              x = leftPoint.x - hatWidth/3.5;
              y = leftEyeBrow[0].y + 25*scaleHeight;
            }
            

            canvasElement.width = width;
            canvasElement.style.width = width*(1/scaleHeight) + 'px';
            canvasElement.height = hatImage.height * scaleWidth;

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

    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    const leftPoint = leftEye[0];
    const rightPoint = rightEye[rightEye.length - 1];

    let widthScale;

    
    const scaleWidth = (attachmentPhoto.width / attachmentPhoto.naturalWidth);
    const scaleHeight = (attachmentPhoto.height / attachmentPhoto.naturalHeight);
    let width;
    let hatAspectRatio;
    let hatHeight;

    if (hatImage.src.includes('overlay-cap-2')) {
      widthScale = 7;
      width = (rightPoint.x - leftPoint.x) * widthScale;
      hatAspectRatio = hatImage.width / hatImage.height;
      hatHeight = width / hatAspectRatio;
      canvasElement.style.left = (leftPoint.x * scaleWidth - width * scaleWidth / 2.45) + 'px';
      canvasElement.style.top = (leftEye[0].y * scaleHeight + hatHeight * scaleHeight * (8.5 / 100)) + 'px';
      staticX = (leftPoint.x * scaleWidth - width * scaleWidth / 2.45);
      staticY = (leftEye[0].y * scaleHeight + hatHeight * scaleHeight * (8.5 / 100));
    } 
    else {
      widthScale = 4.5;
      width = (rightPoint.x - leftPoint.x) * widthScale;
      hatAspectRatio = hatImage.width / hatImage.height;
      hatHeight = width / hatAspectRatio;
      canvasElement.style.left = (leftPoint.x * scaleWidth - width * scaleWidth / 3) + 'px';
      canvasElement.style.top = (leftEye[0].y * scaleHeight + hatHeight * scaleHeight * (2.5 / 100)) + 'px';
      staticX = (leftPoint.x * scaleWidth - width * scaleWidth / 3);
      staticY = (leftEye[0].y * scaleHeight + hatHeight * scaleHeight * (2.5 / 100));
    }

    canvasElement.width = width;
    canvasElement.height = hatHeight;
    canvasElement.style.width = width * scaleWidth + 'px';
    console.log(canvasElement.height);
    staticHatWidth = width * scaleWidth; 


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