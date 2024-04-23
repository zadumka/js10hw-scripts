//date lib
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// alert lib
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// icon
import iconError from '../img/error-icon.svg';

const dateInput = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');

startBtn.setAttribute('disabled', true);

const daysDOM = document.querySelector('[data-days]');
const hoursDOM = document.querySelector('[data-hours]');
const minutesDOM = document.querySelector('[data-minutes]');
const secondsDOM = document.querySelector('[data-seconds]');

let userSelectedDate;
let timerId = 0;
let counter = 1000;
let currentDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const dateNow = new Date();
    currentDate = dateNow;
    if (selectedDates[0] < dateNow) {
      iziToast.show({
        title: 'Error',
        titleColor: '#fff',
        message: 'Please choose a date in the future',
        messageColor: '#fff',
        backgroundColor: '#EF4040',
        position: 'topCenter',
        messageLineHeight: '24px',
        messageSize: '16px',
        iconUrl: iconError,
        theme: 'dark',
      });
    } else {
      startBtn.removeAttribute('disabled');
      userSelectedDate = selectedDates[0];
    }
  },
};

const fp = flatpickr(dateInput, options);

startBtn.addEventListener('click', startTimer);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function startTimer() {
  startBtn.setAttribute('disabled', true);
  dateInput.setAttribute('disabled', true);

  timerId = setInterval(() => {
    let timeLeft = userSelectedDate.getTime() - currentDate.getTime() - counter;

    counter += 1000;

    if (timeLeft < 0) {
      clearInterval(timerId);
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeLeft);

    daysDOM.textContent = addLeadingZero(days);
    hoursDOM.textContent = addLeadingZero(hours);
    minutesDOM.textContent = addLeadingZero(minutes);
    secondsDOM.textContent = addLeadingZero(seconds);
  }, 1000);
}
