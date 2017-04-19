'use strict';

var tokyoMap = document.querySelector('.tokyo__pin-map');

var offerDialog = document.querySelector('#offer-dialog');

var title = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var types = ['flat', 'house', 'bungalo'];

var checkinTimes = ['12:00', '13:00', '14:00'];

var checkoutTimes = ['12:00', '13:00', '14:00'];

var features = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'];

// создаeм данные для lodge


function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Создайте массив, состоящий из 8 сгенерированных JS объектов,
// которые будут описывать похожие объявления неподалеку

var mapData = function setupMapData() {
  var data = [];
  for (var i = 0; i < 8; i++) {
    var x = getRandomNum(300, 900);
    var y = getRandomNum(100, 500);
    data.push({
      author: {
        avatar: `img/avatars/user0${i + 1}.png`
      },
      offer: {
        title: title[i],
        address: x + ',' + y,
        price: getRandomNum(1000, 1000000),
        type: types[getRandomNum(0, 2)],
        rooms: getRandomNum(1, 5),
        guests: getRandomNum(1, 3),
        checkin: checkinTimes[getRandomNum(0, 2)],
        checkout: checkoutTimes[getRandomNum(0, 2)],
        features: features.splice(0, getRandomNum(1, 5)),
        description: '',
        photos: []
      },
      location: {x: x, y: y}
    });
  }
  return data;
};


// На основе данных, созданных в предыдущем пункте создайте DOM-элементы,
// соответствующие меткам на карте случайно сгенерированных объявлений
// и заполните их данными из массива.


var renderPin = function (pin) {
  var pinTemplate = document.querySelector('#pin-template').content;
  var pinElement = pinTemplate.cloneNode(true);
  var pinStyle = pinElement.querySelector('.pin').style;
  var image = pinElement.querySelector('.rounded');

  pinStyle.left = (pin.location.x - (image.width / 2)) + 'px';
  pinStyle.bottom = pin.location.y + 'px';
  image.src = pin.author.avatar;

  return pinElement;
};

// Отрисуйте сгенерированные DOM-элементы в блок .tokyo__pin-map.
// Для вставки элементов используйте DocumentFragment.

function addPins() {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < mapData.length; i++) {
    fragment.appendChild(renderPin(mapData[i]));
  }
  tokyoMap.appendChild(fragment);
}

// На основе первого по порядку элемента из сгенерированного массива
// и шаблона #lodge-template создайте DOM-элемент,
// заполните его данными из объекта и вставьте полученный DOM-элемент
// вместо блока .dialog__panel

function setLodgeType(dialogPanelElement, lodgeType) {
  var lodgeTypeElement = dialogPanelElement.querySelector('.lodge__type');
  switch (lodgeType) {
    case types[0]:
      lodgeTypeElement.textContent = 'Квартира';
      break;
    case types[1]:
      lodgeTypeElement.textContent = 'Дом';
      break;
    case types[2]:
      lodgeTypeElement.textContent = 'Бунгало';
      break;
  }
}

var renderLodge = function (lodgeInfo) {
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
};

function addAvatar(lodgeInfo) {
  var image = offerDialog.querySelector('.dialog__title').querySelector('img');
  image.src = lodgeInfo.author.avatar;
}

function addLodgeDetails() {
  var data = mapData[0];
  var fragment = document.createDocumentFragment();

  addAvatar(data);
  fragment.appendChild(renderLodge(data));
  offerDialog.replaceChild(fragment, offerDialog.querySelector('.dialog__panel'));
}

addPins();
addLodgeDetails();
