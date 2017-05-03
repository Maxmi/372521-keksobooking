'use strict';

// При нажатии на любой из элементов .pin ему должен добавляться класс pin--active
// и должен показываться элемент .dialog

var offerDialog = document.querySelector('#offer-dialog');

var tokyoMap = document.querySelector('.tokyo__pin-map');

var closeElement = offerDialog.querySelector('.dialog__close');

// При нажатии на элемент .dialog__close карточка объявления
// должна скрываться. При этом должен деактивироваться элемент .pin, который был помечен как активный
var closeDialog = function () {
  var pinElements = document.querySelectorAll('.pin');
  offerDialog.classList.add('hidden');
  clearActivePins(pinElements);
};

var mapData = setupMapData();

var ENTER_KEY_CODE = 13;

var ESC_KEY_CODE = 27;

// При нажатии на элемент .dialog__close карточка объявления должна скрываться.
// При этом должен деактивироваться элемент .pin, который был помечен как активный

closeElement.addEventListener('click', function (evt) {
  evt.preventDefault();
  closeDialog();
});

closeElement.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEY_CODE) {
    closeDialog();
  }
});

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEY_CODE && !offerDialog.classList.contains('hidden')) {
    closeDialog();
  }
});

// создаeм данные для lodge

function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Создайте массив, состоящий из 8 сгенерированных JS объектов,
// которые будут описывать похожие объявления неподалеку

function setupMapData() {
  var data = [];
  for (var i = 0; i < 8; i++) {
    var x = getRandomNum(300, 900);
    var y = getRandomNum(100, 500);
    data.push({
      author: {
        avatar: `img/avatars/user0${i + 1}.png`
      },
      offer: {
        title: window.consts.title[i],
        address: x + ',' + y,
        price: getRandomNum(1000, 1000000),
        type: window.consts.types[getRandomNum(0, 2)],
        rooms: getRandomNum(1, 5),
        guests: getRandomNum(1, 3),
        checkin: window.consts.checkinTimes[getRandomNum(0, 2)],
        checkout: window.consts.checkoutTimes[getRandomNum(0, 2)],
        features: window.consts.features.splice(0, getRandomNum(1, 5)),
        description: '',
        photos: []
      },
      location: {x: x, y: y}
    });
  }
  return data;
}


// На основе данных, созданных в предыдущем пункте создайте DOM-элементы,
// соответствующие меткам на карте случайно сгенерированных объявлений
// и заполните их данными из массива.


function renderPin(pin, index) {
  var pinTemplate = document.querySelector('#pin-template').content;
  var pinElement = pinTemplate.cloneNode(true);
  var pinDomEl = pinElement.querySelector('.pin');

  var pinStyle = pinDomEl.style;
  var image = pinElement.querySelector('.rounded');
  pinDomEl.setAttribute('tabindex', 0);
  pinDomEl.setAttribute('data-index', index);

  pinStyle.left = (pin.location.x - (image.width / 2)) + 'px';
  pinStyle.bottom = pin.location.y + 'px';
  image.src = pin.author.avatar;

  return pinElement;
}

// Отрисуйте сгенерированные DOM-элементы в блок .tokyo__pin-map.
// Для вставки элементов используйте DocumentFragment.

function addPins() {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < mapData.length; i++) {
    var pinElement = renderPin(mapData[i], i);
    fragment.appendChild(pinElement);
  }
  tokyoMap.appendChild(fragment);
}


function clearActivePins(pinElements) {
  pinElements.forEach(function (pinElement) {
    if (pinElement.classList.contains('pin--active')) {
      pinElement.classList.remove('pin--active');
      offerDialog.classList.add('hidden');
    }

  });
}

function setupPinsHandler() {
  var pinElements = document.querySelectorAll('.pin');
  // Если до этого у другого элемента существовал класс pin--active,
  // то у этого элемента класс нужно убрать
  pinElements.forEach(function (pinElement) {
    pinElement.addEventListener('click', activatePinHandler); // this is called reference
    pinElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEY_CODE) {
        activatePinHandler(evt);
      }
    });
  });
}

function activatePinHandler(evt) {
  var target = evt.target;
  var pinElements = document.querySelectorAll('.pin');
  var pinDomEl;
  if (target.classList.contains('pin')) {
    pinDomEl = target;
  } else if (target.parentElement.classList.contains('pin')) {
    pinDomEl = target.parentElement;
  }
  clearActivePins(pinElements);
  pinDomEl.classList.add('pin--active');
  var pinIndex = pinDomEl.getAttribute('data-index');
  addLodgeDetails(mapData[pinIndex]);
}

// На основе первого по порядку элемента из сгенерированного массива
// и шаблона #lodge-template создайте DOM-элемент,
// заполните его данными из объекта и вставьте полученный DOM-элемент
// вместо блока .dialog__panel

function setLodgeType(dialogPanelElement, lodgeType) {
  var lodgeTypeElement = dialogPanelElement.querySelector('.lodge__type');
  switch (lodgeType) {
    case window.consts.types[0]:
      lodgeTypeElement.textContent = 'Квартира';
      break;
    case window.consts.types[1]:
      lodgeTypeElement.textContent = 'Дом';
      break;
    case window.consts.types[2]:
      lodgeTypeElement.textContent = 'Бунгало';
      break;
  }
}

function renderLodge(lodgeInfo) {
  var dialogPanelTemplate = document.querySelector('#lodge-template').content;
  var dialogPanelElement = dialogPanelTemplate.cloneNode(true);
  var lodgeTitle = dialogPanelElement.querySelector('.lodge__title');
  var lodgeAddress = dialogPanelElement.querySelector('.lodge__address');
  var lodgeFeatures = dialogPanelElement.querySelector('.lodge__features');
  var lodgePrice = dialogPanelElement.querySelector('.lodge__price');
  var lodgeGuests = dialogPanelElement.querySelector('.lodge__rooms-and-guests');
  var lodgeCheckinTime = dialogPanelElement.querySelector('.lodge__checkin-time');

  lodgeTitle.textContent = lodgeInfo.offer.title;
  lodgeAddress.textContent = lodgeInfo.offer.address;
  lodgePrice.innerHTML = lodgeInfo.offer.price + '&#x20bd;/ночь';
  setLodgeType(dialogPanelElement, lodgeInfo.offer.type);
  lodgeGuests.textContent = `Для ${lodgeInfo.offer.guests} гостей в ${lodgeInfo.offer.rooms} комнатах`;
  lodgeCheckinTime.textContent = `Заезд после ${lodgeInfo.offer.checkin}, выезд до ${lodgeInfo.offer.checkout}`;


  for (var i = 0; i < lodgeInfo.offer.features.length; i++) {
    var span = document.createElement('SPAN');
    span.classList.add('feature__image', `feature__image--${lodgeInfo.offer.features[i]}`);
    lodgeFeatures.appendChild(span);
  }

  dialogPanelElement.querySelector('.lodge__description').textContent = lodgeInfo.offer.description;

  return dialogPanelElement;
}

function addAvatar(lodgeInfo) {
  var image = offerDialog.querySelector('.dialog__title').querySelector('img');
  image.src = lodgeInfo.author.avatar;
}

function addLodgeDetails(data) {
  var fragment = document.createDocumentFragment();
  addAvatar(data);
  fragment.appendChild(renderLodge(data));
  offerDialog.replaceChild(fragment, offerDialog.querySelector('.dialog__panel'));
  offerDialog.classList.remove('hidden');
}


addPins();
setupPinsHandler();
