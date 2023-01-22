// data fetching
const BASE_API = 'https://api.hadith.gading.dev/books';
const spinnerEl = document.querySelector('#spinner');
const errorEl = document.querySelector('#error-404');
const arabEl = document.querySelectorAll('.content-arab');
const idEl = document.querySelectorAll('.content-id');

let downloadName = 'hadits-harian.png';

const randomizeBook = () => {
  return new Promise((resolve, reject) => {
    fetch(BASE_API)
      .then((res) => res.json())
      .then((data) => {
        const randomized = Math.floor(Math.random() * data.data?.length);
        resolve(data.data[randomized]);
      })
      .catch((err) => reject(err));
  });
};
const randomizeHadits = async () => {
  try {
    const { id, name, available } = await randomizeBook();
    const randomized = Math.floor(Math.random() * available) + 1;
    const data = await fetch(`${BASE_API}/${id}/${randomized}`).then((res) =>
      res.json()
    );
    const populated = {
      name,
      arab: data.data.contents.arab,
      id: data.data.contents.id,
      number: data.data.contents.number,
    };
    arabEl.forEach((el) => {
      el.innerText = populated.arab;
    });
    idEl.forEach((el) => {
      el.innerText = `${populated.id} ~ (${populated.name} - No. ${populated.number})`;
    });
    downloadName = `${id}-${populated.number}.png`;
    // console.log(downloadName);
    hide(spinnerEl);
  } catch (error) {
    hide(spinnerEl);
    show(errorEl);
  }
};

randomizeHadits();

// render
function show(el) {
  el.classList.remove('hidden');
}
function hide(el) {
  el.classList.add('hidden');
}

// content saving
const notifyMeToggler = document.querySelector('#notify-me-toggler');
const notifyMe = document.querySelector('#notify-me');
let notifyMeOpen = false;
const saveAsImageButton = document.querySelector('#save-as-image');

const showNotifyMe = () => {
  notifyMe.classList.toggle('scale-0');
  notifyMe.classList.toggle('scale-1');
  notifyMeOpen = !notifyMeOpen;
};

const saveAsImage = () => {
  const content = document.querySelector('#downloadable');
  html2canvas(content).then((canvas) => {
    const canvasURL = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = canvasURL;
    downloadLink.download = downloadName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });
};

notifyMeToggler.addEventListener('click', showNotifyMe);
notifyMe.addEventListener('click', (e) => {
  e.stopPropagation();
});
saveAsImageButton.addEventListener('click', saveAsImage);

document.onclick = (e) => {
  const isClickOutside =
    e.target !== notifyMe && e.target !== notifyMeToggler && notifyMeOpen;
  if (isClickOutside) {
    showNotifyMe();
  }
};

// notification request
const scheduleInput = document.querySelector('#schedule');
const makeNotifBtn = document.querySelector('#make-notif');

makeNotifBtn.addEventListener('click', () => {
  if ('Notification' in window) {
    Notification.requestPermission((res) => {
      if (res === 'granted') {
      }
      if (res === 'denied') {
        alert('Please allow notification.');
      }
    });
  }
});

// sw regstration

window.onload = () => {
  navigator.serviceWorker
    .register('./sw.js', {
      scope: './',
    })
    .then(() => console.log('sw registered'));
};
