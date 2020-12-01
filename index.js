const body = document.querySelector('body');
let mode = 'freeze';
let emptyElement;
let currentField;
let size = 4;
let count = 0;
let soundPush = false;
let blocksArray;
let scoreWrapper;
let time = 0;
let timeStart;
let results = localStorage.getItem('pooledData') === undefined ? null : JSON.parse(localStorage.getItem('pooledData'));
const navigation = document.createElement('div');
const field = document.createElement('div');
const pausePopup = document.createElement('div');
const sizePopup = document.createElement('div');
const gameImg = document.createElement('span');
const gameNumb = document.createElement('span');

const timerInterval = () => {
  timeStart = Date.now();
  const timer = setInterval(() => {
    if (mode !== 'start') {
      time += Date.now() - timeStart;
      clearInterval(timer);
    } else {
      const timeCounter = Date.now() - timeStart + time;
      const minutes = Math.floor((timeCounter % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeCounter % (1000 * 60)) / 1000);
      document.getElementById('timeInfo').innerText = `Time: ${minutes} : ${seconds}`;
    }
  }, 1000);
};

const clearTimer = () => {
  count = 0;
  document.getElementById('moves').innerText = `Moves: ${count}`;
  time = 0;
  document.getElementById('timeInfo').innerText = 'Time: 0 : 0';
};

// eslint-disable-next-line consistent-return
const pauseStart = (changeRegime) => {
  if (changeRegime === undefined) {
    if (mode === 'freeze') {
      return mode;
    }
    if (mode === 'start') {
      mode = 'pause';
    } else { mode = 'start'; }
  } else {
    mode = changeRegime;
  }
  if (mode === 'pause') {
    pausePopup.style.display = 'flex';
    document.getElementById('pauseGame').innerText = 'continue';
  } else if (mode === 'start') {
    timerInterval();
    pausePopup.style.display = 'none';
    document.getElementById('pauseGame').innerText = 'pause';
  }
};

const pauseSize = () => {
  mode = 'freeze';
  sizePopup.style.display = 'flex';
  if (mode === 'pause' || mode === 'start') {
    sizePopup.style.display = 'flex';
  }
};

const achievement = () => {
  if (results == null) {
    results = {
      bestTime: [{ time: time + Date.now() - timeStart, move: count, size }],
    };
  } else if (results.bestTime.length < 10) {
    results.bestTime.push({ time: time + Date.now() - timeStart, move: count, size });
  } else {
    let max = 0;
    for (let i = 0; i < results.bestTime.length; i += 1) {
      if (results.bestTime[i].time > results.bestTime[max].time) {
        max = i;
      }
    }
    if (time < results.bestTime[max].time) {
      results.bestTime[max] = {
        time: time + Date.now() - timeStart,
        move: count,
        size,
      };
    }
  }
  localStorage.setItem('pooledData', JSON.stringify(results));
};

const showResults = () => {
  scoreWrapper.style.display = 'flex';
  const bestTime = document.getElementById('scoreTime');
  bestTime.innerHTML = '<div>Best scores:</div>';

  if (results != null) {
    for (let i = 0; i < results.bestTime.length; i += 1) {
      const element = document.createElement('div');
      const minutes = Math.floor((results.bestTime[i].time % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((results.bestTime[i].time % (1000 * 60)) / 1000);

      element.innerText = `Time: ${minutes}:${seconds}  ,  Moves: ${results.bestTime[i].move} ${results.bestTime[i].size}x${results.bestTime[i].size}`;
      if (i % 2 === 0) {
        element.className = 'bestScoresInfo';
      }
      bestTime.appendChild(element);
    }
  }
};

const isSolved = () => {
  if (+emptyElement === size * size) {
    let solved = true;
    for (let i = 1; i < size * size - 1 && solved; i += 1) {
      if (blocksArray[i].value !== i) {
        solved = false;
        return;
      }
    }
    if (solved) {
      const minutes = Math.floor(
        ((time + Date.now() - timeStart) % (1000 * 60 * 60)) / (1000 * 60),
      );
      const seconds = Math.floor(((time + Date.now() - timeStart) % (1000 * 60)) / 1000);
      document.getElementById('congratulations').innerText = `Congratulations! You solved puzzle for ${minutes} : ${seconds} and ${count} moves`;
      achievement();
      showResults();
      clearTimer();
      pauseStart('freeze');
    }
  }
};

const save = () => {
  if (mode !== 'freeze') {
    currentField = {
      blocksArray,
      time: time + Date.now() - timeStart,
      count,
      size,
      emptyElement,
    };
    localStorage.setItem('currentField ', JSON.stringify(currentField));
  }
};

const ceilsArray = () => {
  blocksArray = {};
  for (let y = 0, k = 0; y < size; y += 1) {
    for (let x = 0; x < size && k < size * size - 1; x += 1, k += 1) {
      const value = y * size + x + 1;
      blocksArray[value] = { x, y, value };
    }
  }
  blocksArray[size * size] = null;
};

const createField = () => {
  field.innerHTML = '';
  field.style.height = `${field.offsetWidth}px`;
  const ceilHeight = field.offsetWidth / size;
  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      if (blocksArray[i * size + j + 1] != null) {
        const blockInArray = blocksArray[i * size + j + 1];
        const block = document.createElement('div');
        block.classList.add('ceil');
        block.innerText = blockInArray.value;

        document.getElementById('number').addEventListener('click', () => {
          block.style.background = 'rgb(43, 183, 226)';
          block.style.color = '#a0f5a7';
          document.getElementById('number').style.color = '#DC8513';
          document.getElementById('image').style.color = 'black';
        });

        // eslint-disable-next-line no-loop-func
        document.getElementById('image').addEventListener('click', () => {
          switch (size) {
            case 3:
              block.style.backgroundImage = `url(./assets/img/3x3/${blockInArray.value}.jpg)`;
              break;
            case 4:
              block.style.backgroundImage = `url(./assets/img/4x4/${blockInArray.value}.jpg)`;
              break;
            case 5:
              block.style.backgroundImage = `url(./assets/img/5x5/${blockInArray.value}.jpg)`;
              break;
            case 6:
              block.style.backgroundImage = `url(./assets/img/6x6/${blockInArray.value}.jpg)`;
              break;
            case 7:
              block.style.backgroundImage = `url(./assets/img/7x7/${blockInArray.value}.jpg)`;
              break;
            case 8:
              block.style.backgroundImage = `url(./assets/img/8x8/${blockInArray.value}.jpg)`;
              break;
            default:
              block.style.backgroundImage = `url(./assets/img/4x4/${blockInArray.value}.jpg)`;
              break;
          }
          block.style.color = 'transparent';
          document.getElementById('image').style.color = '#DC8513';
          document.getElementById('number').style.color = 'black';
        });

        switch (size) {
          case 3:
            block.style.backgroundImage = `url(./assets/img/3x3/${blockInArray.value}.jpg)`;
            break;
          case 4:
            block.style.backgroundImage = `url(./assets/img/4x4/${blockInArray.value}.jpg)`;
            break;
          case 5:
            block.style.backgroundImage = `url(./assets/img/5x5/${blockInArray.value}.jpg)`;
            break;
          case 6:
            block.style.backgroundImage = `url(./assets/img/6x6/${blockInArray.value}.jpg)`;
            break;
          case 7:
            block.style.backgroundImage = `url(./assets/img/7x7/${blockInArray.value}.jpg)`;
            break;
          case 8:
            block.style.backgroundImage = `url(./assets/img/8x8/${blockInArray.value}.jpg)`;
            break;
          default:
            block.style.backgroundImage = `url(./assets/img/4x4/${blockInArray.value}.jpg)`;
            break;
        }
        block.style.color = 'transparent';

        block.id = `${[i * size + j + 1]}`;
        block.style.height = `${ceilHeight - 3}px`;
        block.style.width = `${ceilHeight - 3}px`;
        block.style.fontSize = `${ceilHeight * 0.7}px`;
        block.style.top = `${blockInArray.y * ceilHeight + navigation.offsetTop + navigation.offsetHeight}px`;
        block.style.left = `${blockInArray.x * ceilHeight + navigation.offsetLeft + navigation.offsetWidth * 0.05}px`;
        block.style.zIndex = `${blockInArray.value + 8}`;

        field.appendChild(block);
      }
    }
  }
  pausePopup.style.top = `${field.offsetTop + field.offsetWidth * 0.4}px`;
  pausePopup.style.fontSize = `${field.offsetWidth * 0.2}px`;
  pausePopup.style.left = `${field.offsetLeft + field.offsetWidth * 0.28}px`;

  sizePopup.style.top = `${field.offsetTop + field.offsetWidth * 0.4}px`;
  sizePopup.style.fontSize = `${field.offsetWidth * 0.1}px`;
  sizePopup.style.left = `${field.offsetLeft + field.offsetWidth * 0.24}px`;
};

const changeSize = (number) => {
  if (pausePopup.style.display === 'flex') { return; }
  clearTimer();
  size = number;
  ceilsArray();
  createField();
  pauseSize();
};

const winFieldProve = () => {
  const array = [];
  for (let i = 0, k = 1; i < size; i += 1) {
    const subArray = [];
    for (let j = 0; j < size; j += 1, k += 1) {
      subArray.push(blocksArray[k]);
    }
    array.push(subArray);
  }
  let wrongCount = 0;

  for (let i = 0; i < array.length; i += 1) {
    for (let j = 0; j < array[i].length - 1; j += 1) {
      for (let k = j + 1; k < array[i].length; k += 1) {
        if (array[i][j] != null && array[i][k] != null && array[i][j].value > array[i][k].value) {
          wrongCount += 1;
        }
      }
    }
  }
  if (wrongCount % 2 !== 0) {
    const block = array[0][size - 1].value;
    array[0][size - 1].value = array[0][size - 2].value;
    array[0][size - 2].value = block;
  }
  wrongCount = 0;
  for (let i = 0; i < array.length; i += 1) {
    for (let j = 0; j < array[i].length - 1; j += 1) {
      for (let k = j + 1; k < array[i].length; k += 1) {
        if (array[i][j] != null && array[i][k] != null && array[i][j].value > array[i][k].value) {
          wrongCount += 1;
        }
      }
    }
  }
};

const startGame = () => {
  clearTimer();
  ceilsArray();
  pauseStart('start');
  document.querySelector('.sizePopup').style.display = 'none';

  localStorage.removeItem('currentField');
  const aimArray = [];
  for (let i = 1; i < size * size; i += 1) {
    aimArray.push(i);
  }
  for (let i = 0, k = 0; i < size; i += 1) {
    for (let j = 0; j < size && k < size * size - 1; j += 1, k += 1) {
      const random = Math.trunc(Math.random() * (aimArray.length));
      blocksArray[i * size + j + 1].value = aimArray[random];
      aimArray.splice(random, 1);
    }
  }

  winFieldProve();
  createField();
  emptyElement = size * size;
  timerInterval();
};

const init = () => {
  navigation.classList.add('navigation');
  navigation.id = 'navigation';

  const audio = document.createElement('audio');
  audio.setAttribute('src', './assets/sounds/field.wav');

  const menu = document.createElement('div');
  menu.classList.add('menu');
  menu.id = 'menu';
  const newGame = document.createElement('div');
  newGame.id = 'newGame';
  newGame.innerHTML = 'new game';
  const saveGame = document.createElement('div');
  saveGame.id = 'saveGame';
  saveGame.innerHTML = 'save game';
  const pauseGame = document.createElement('div');
  pauseGame.id = 'pauseGame';
  pauseGame.innerHTML = `${mode === 'freeze' ? 'pause' : 'continue'}`;
  const gameResults = document.createElement('div');
  gameResults.id = 'gameResults';
  gameResults.innerHTML = 'score';
  const gameSound = document.createElement('div');
  gameSound.id = 'sound';
  gameSound.innerHTML = 'sound';
  gameImg.id = 'image';
  gameImg.classList.add('image');
  gameImg.innerHTML = 'I-mode';
  gameNumb.id = 'number';
  gameNumb.classList.add('number');
  gameNumb.innerHTML = 'N-mode';
  const gameMode = document.createElement('div');
  gameMode.innerHTML = `${gameImg.outerHTML}/${gameNumb.outerHTML}`;

  menu.innerHTML += newGame.outerHTML + pauseGame.outerHTML + saveGame.outerHTML;
  menu.innerHTML += gameResults.outerHTML + gameSound.outerHTML;

  const data = document.createElement('div');
  data.classList.add('data');
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);
  const timer = document.createElement('div');
  timer.id = 'timeInfo';
  timer.innerHTML = `Time: ${minutes} : ${seconds}`;
  const moves = document.createElement('div');
  moves.id = 'moves';
  moves.innerHTML = `Moves:${minutes}:${seconds}`;

  data.innerHTML += timer.outerHTML + gameMode.outerHTML + moves.outerHTML;

  field.classList.add('field');
  field.id = 'field';

  pausePopup.className = 'pausePopup';
  pausePopup.innerText = 'paused';

  sizePopup.className = 'sizePopup';
  sizePopup.innerText = 'press new game';

  scoreWrapper = document.createElement('div');
  scoreWrapper.classList.add('scoreWrapper');
  scoreWrapper.id = 'scoreWrapper';
  const congratulations = document.createElement('div');
  congratulations.id = 'congratulations';
  congratulations.innerHTML = 'Congratulations!';
  const scoreTime = document.createElement('div');
  scoreTime.classList.add('scoreTime');
  scoreTime.id = 'scoreTime';

  scoreWrapper.innerHTML += congratulations.outerHTML + scoreTime.outerHTML;
  scoreWrapper.addEventListener('click', () => {
    document.getElementById('congratulations').innerText = '';
    document.getElementById('scoreWrapper').style.display = 'none';
  });

  const sizeChange = document.createElement('div');
  sizeChange.classList.add('size-change');

  for (let i = 3; i <= 8; i += 1) {
    const option = document.createElement('div');
    option.innerText = `${i}x${i}`;
    option.value = `${i}`;
    option.addEventListener('click', () => {
      clearTimer();
      changeSize(i);
    });
    sizeChange.appendChild(option);
  }

  navigation.appendChild(menu);
  navigation.appendChild(data);
  body.appendChild(navigation);
  body.appendChild(scoreWrapper);
  body.appendChild(field);
  body.appendChild(pausePopup);
  body.appendChild(sizePopup);
  body.appendChild(sizeChange);
  body.appendChild(audio);

  const makeSound = () => {
    if (soundPush) { audio.play(); }
  };

  menu.addEventListener('click', (e) => {
    switch (e.target.id) {
      case 'newGame':
        startGame();
        break;
      case 'pauseGame':
        pauseStart();
        break;
      case 'saveGame':
        save();
        break;
      case 'gameResults':
        showResults();
        break;
      case 'sound':
        soundPush = !soundPush;
        if (soundPush) {
          document.getElementById('sound').style.background = 'rgb(43, 183, 226)';
        } else { document.getElementById('sound').style.background = ''; }
        makeSound();
        break;
      default:
        break;
    }
  });

  field.onmousedown = (e) => {
    makeSound();
    const { target } = e;
    if (target.id !== 'field' && mode === 'start' && e.which === 1) {
      const posMouseDownX = e.clientX;
      const posMouseDownY = e.clientY;

      const positionNow = Number.parseInt(target.id, 10);
      const newPosition = Number.parseInt(emptyElement, 10);
      const block = blocksArray[target.id];
      const ceilHeight = field.offsetWidth / size;

      const changePosition = () => {
        target.style.transition = 'top  0.2s linear, left 0.2s linear';
        document.onmousemove = null;
        document.onmouseup = null;
        count += 1;
        document.getElementById('moves').innerText = `Moves: ${count}`;
        emptyElement = target.id;
        target.id = newPosition;
        blocksArray[target.id] = block;
        blocksArray[emptyElement] = null;
        target.style.left = `${block.x * ceilHeight + navigation.offsetLeft + navigation.offsetWidth * 0.05}px`;
        target.style.top = `${block.y * ceilHeight + navigation.offsetTop + navigation.offsetHeight}px`;
        isSolved();
      };

      if (positionNow + 1 === newPosition && block.x < size - 1) {
        document.onmouseup = () => {
          block.x += 1;
          changePosition();
        };
        document.onmousemove = (e1) => {
          target.style.transition = 'top  0.0s linear, left 0.0s linear';
          const newPosMouseX = e1.clientX;
          let distance = newPosMouseX - posMouseDownX;
          if (distance > 0) {
            if (distance < (ceilHeight + 1)) {
              distance = newPosMouseX - posMouseDownX;
            } else { distance = ceilHeight; }
          } else { distance = 0; }

          target.style.left = `${block.x * ceilHeight + navigation.offsetLeft + navigation.offsetWidth * 0.05 + distance}px`;
        };
      } else if (positionNow - 1 === newPosition && block.x > 0) {
        document.onmouseup = () => {
          block.x -= 1;
          changePosition();
        };
        document.onmousemove = (e2) => {
          target.style.transition = 'top  0.0s linear, left 0.0s linear';
          const newPosMouseX = e2.clientX;
          let distance = posMouseDownX - newPosMouseX;
          if (distance > 0) {
            if (distance < (ceilHeight + 1)) {
              distance = posMouseDownX - newPosMouseX;
            } else { distance = ceilHeight; }
          } else { distance = 0; }
          target.style.left = `${block.x * ceilHeight + navigation.offsetLeft + navigation.offsetWidth * 0.05 - distance}px`;
        };
      } else
      if (positionNow + size === newPosition) {
        document.onmouseup = () => {
          block.y += 1;
          changePosition();
        };
        document.onmousemove = (e3) => {
          target.style.transition = 'top  0.0s linear, left 0.0s linear';
          const newPosMouseY = e3.clientY;
          let distance = newPosMouseY - posMouseDownY;
          if (distance > 0) {
            if (distance < (ceilHeight + 1)) {
              distance = newPosMouseY - posMouseDownY;
            } else { distance = ceilHeight; }
          } else { distance = 0; }
          target.style.top = `${block.y * ceilHeight + navigation.offsetTop + navigation.offsetHeight + distance}px`;
        };
      } else if (positionNow - size === newPosition) {
        document.onmouseup = () => {
          block.y -= 1;
          changePosition();
        };
        document.onmousemove = (e4) => {
          target.style.transition = 'top  0.0s linear, left 0.0s linear';
          const newPosMouseY = e4.clientY;
          let distance = posMouseDownY - newPosMouseY;
          if (distance > 0) {
            if (distance < (ceilHeight + 1)) {
              distance = posMouseDownY - newPosMouseY;
            } else { distance = ceilHeight; }
          } else { distance = 0; }
          target.style.top = `${block.y * ceilHeight + navigation.offsetTop + navigation.offsetHeight - distance}px`;
        };
      }
    }
  };
};

if (localStorage.getItem('currentField ')) {
  currentField = JSON.parse(localStorage.getItem('currentField '));
  size = currentField.size;
  time = currentField.time;
  count = currentField.count;
  blocksArray = currentField.blocksArray;
  emptyElement = currentField.emptyElement;
}

init();

if (currentField === undefined) {
  changeSize(size);
} else {
  createField();
  pauseStart('pause');
}

window.onresize = () => {
  createField();
};
