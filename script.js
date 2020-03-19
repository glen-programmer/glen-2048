const colorsMap = new Map([
  ["", "#FFFFFF"],
  ["2", "#DFFDD3"],
  ["4", "#C5FFAD"],
  ["8", "#7DFF47"],
  ["16", "#9AFF70"],
  ["32", "#4BFF00"],
  ["64", "#68F07E"],
  ["128", "#3FD700"],
  ["256", "#31A800"],
  ["512", "#227400"],
  ["1024", "#8AABFF"],
  ["2048", "#FFA959"],
  ["4096", "#F2A4FF"],
  ["8192", "#FF8C8C"],
  ["16384", "#FF5B5B"],
  ["32768", "#DD0000"],
]);

const mainGridCells = document.querySelectorAll(".main-grid-cell");
const mainGridCellLabels = document.querySelectorAll(".main-grid-cell-label");
const userScoreLabel = document.querySelector(".info-user-score");
const resetButton = document.querySelector(".info-reset-button");
// Audio never works well on IOS as safari doesn't allow preload
const collsionSound = new Audio("./sound/collision_sound.mp3");
const errorSound = new Audio("./sound/error_sound.mp3");
collsionSound.volume = 0.5;
errorSound.volume = 0.5;
const mainGrid = document.querySelector(".main-grid");
let oldInnerHTML;
let userScore = 0;

let startPos;
let endPos;

resetButton.addEventListener("click", () => {
  init();
});

document.addEventListener("keydown", e => {
  console.log(e.key);
  eventHandler(e.key);
});

mainGrid.addEventListener("touchstart", el => {
  startPos = el.touches[0];
});

mainGrid.addEventListener("touchmove", el => {
  endPos = el.touches[0];
});

mainGrid.addEventListener("touchend", () => {
  // keyname according to vim hjkl
  let startX = startPos.clientX;
  let startY = startPos.clientY;
  let endX = endPos.clientX;
  let endY = endPos.clientY;
  console.log(startX);
  console.log(startY);
  console.log(endX);
  console.log(endY);
  if (Math.abs(startX-endX) > Math.abs(startY-endY)) {
    if ((startX-endX) > 200)
      eventHandler("h");
    if ((endX-startX) > 200)
      eventHandler("l");
  } else {
    if ((startY-endY) > 200)
      eventHandler("k");
    if ((endY-startY) > 200)
      eventHandler("j");
  }
});

function eventHandler(event) {

  // for future comparison
  oldInnerHTML = mainGrid.innerHTML;

  switch (event.toLowerCase()) {
    case "s":
    case "j":
    case "arrowdown":
      console.log("down");
      for (let i = 0; i < 4; ++i)
        updateLine(
          mainGridCellLabels[i + 12],
          mainGridCellLabels[i + 8],
          mainGridCellLabels[i + 4],
          mainGridCellLabels[i]
        );
      break;
    case "w":
    case "k":
    case "arrowup":
      console.log("up");
      for (let i = 0; i < 4; ++i)
        updateLine(
          mainGridCellLabels[i],
          mainGridCellLabels[i + 4],
          mainGridCellLabels[i + 8],
          mainGridCellLabels[i + 12]
        );
      break;
    case "a":
    case "h":
    case "arrowleft":
      console.log("left");
      for (let i = 0; i < 16; i += 4)
        updateLine(
          mainGridCellLabels[i],
          mainGridCellLabels[i + 1],
          mainGridCellLabels[i + 2],
          mainGridCellLabels[i + 3]
        );
      break;
    case "d":
    case "l":
    case "arrowright":
      console.log("right");
      for (let i = 0; i < 16; i += 4)
        updateLine(
          mainGridCellLabels[i + 3],
          mainGridCellLabels[i + 2],
          mainGridCellLabels[i + 1],
          mainGridCellLabels[i]
        );
      break;
    default:
      console.log("Invalid");
      return;
  }

  // if cells didn't change -> no collision takes place -> jumpover new value generation
  if (oldInnerHTML == mainGrid.innerHTML) {
    errorSound.play();
    return;
  }

  if (Number(userScore) > Number(userScoreLabel.textContent))
    collsionSound.play();

  userScoreLabel.textContent = userScore;

  let emptyLabel = getRandomEmptyLabel();
  if (emptyLabel != null) emptyLabel.textContent = getTwoOrFour();
  else alert("You Lose!");

  drawCells();
}



// main logical handler
function updateLine(...labels) {
  let filledLabels = labels.filter(ele => ele.textContent != "");
  if (filledLabels.length == 0) return;
  let value = [0, 0, 0, 0];

  switch (filledLabels.length) {
    case 1:
      value[0] = filledLabels[0].textContent;
      filledLabels[0].textContent = "";
      labels[0].textContent = value[0];
      break;

    case 2:
      value[0] = filledLabels[0].textContent;
      value[1] = filledLabels[1].textContent;
      filledLabels[0].textContent = "";
      filledLabels[1].textContent = "";
      if (value[0] == value[1]) {
        labels[0].textContent = Number(value[0]) + Number(value[1]);
        userScore += Number(labels[0].textContent);
      } else {
        labels[0].textContent = value[0];
        labels[1].textContent = value[1];
      }
      break;

    case 3:
      value[0] = filledLabels[0].textContent;
      value[1] = filledLabels[1].textContent;
      value[2] = filledLabels[2].textContent;
      filledLabels[0].textContent = "";
      filledLabels[1].textContent = "";
      filledLabels[2].textContent = "";
      if (value[0] == value[1]) {
        labels[0].textContent = Number(value[0]) + Number(value[1]);
        labels[1].textContent = value[2];
        userScore += Number(labels[0].textContent);
      } else if (value[1] == value[2]) {
        labels[0].textContent = value[0];
        labels[1].textContent = Number(value[1]) + Number(value[2]);
        userScore += Number(labels[1].textContent);
      } else {
        labels[0].textContent = value[0];
        labels[1].textContent = value[1];
        labels[2].textContent = value[2];
      }
      break;

    case 4:
      value[0] = filledLabels[0].textContent;
      value[1] = filledLabels[1].textContent;
      value[2] = filledLabels[2].textContent;
      value[3] = filledLabels[3].textContent;
      filledLabels[0].textContent = "";
      filledLabels[1].textContent = "";
      filledLabels[2].textContent = "";
      filledLabels[3].textContent = "";
      if (value[0] == value[1]) {
        labels[0].textContent = Number(value[0]) + Number(value[1]);
        userScore += Number(labels[0].textContent);
        if (value[2] == value[3]) {
          labels[1].textContent = Number(value[2]) + Number(value[3]);
          userScore += Number(labels[1].textContent);
        } else {
          labels[1].textContent = value[2];
          labels[2].textContent = value[3];
        }
      } else if (value[1] == value[2]) {
        labels[0].textContent = value[0];
        labels[1].textContent = Number(value[1]) + Number(value[2]);
        labels[2].textContent = value[3];
        userScore += Number(labels[1].textContent);
      } else if (value[2] == value[3]) {
        labels[0].textContent = value[0];
        labels[1].textContent = value[1];
        labels[2].textContent = Number(value[2]) + Number(value[3]);
        userScore += Number(labels[2].textContent);
      } else {
        labels[0].textContent = value[0];
        labels[1].textContent = value[1];
        labels[2].textContent = value[2];
        labels[3].textContent = value[3];
      }
      break;
  }
}

function drawCells() {
  for (let cell of mainGridCells) {
    cell.style.backgroundColor = colorsMap.get(cell.firstElementChild.textContent);
  }
}

function init() {
  initEmptyBoard();
  getRandomEmptyLabel().textContent = getTwoOrFour();
  getRandomEmptyLabel().textContent = getTwoOrFour();
  userScore = 0;
  userScoreLabel.textContent = userScore;
  drawCells();
}

function initEmptyBoard() {
  for (let i = 0; i < mainGridCellLabels.length; ++i)
    mainGridCellLabels[i].textContent = "";
}

// return random number [0,n)
const getRandomNumber = num => Math.floor(Math.random() * num);
const getTwoOrFour = () => (getRandomNumber(2) < 1 ? 2 : 4);

function getRandomEmptyLabel() {
  let emptyLabels = [];
  for (let label of mainGridCellLabels) {
    if (label.textContent == "") emptyLabels.push(label);
  }
  if (emptyLabels.length > 0)
    return emptyLabels[getRandomNumber(emptyLabels.length)];
  return null;
}

init();
