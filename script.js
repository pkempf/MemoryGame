const gameContainer = document.getElementById("game");

localStorage.setItem(
  "best",
  localStorage.getItem("best") ? localStorage.getItem("best") : -1
);

let cardsActive = 0;
let matches = 0;
let guesses = 0;
let candidateID = -1;
let guessCounter = document.getElementById("guesses");
let matchCounter = document.getElementById("matches");
let resetButton = document.getElementById("reset");
let bestScore = document.getElementById("bestScore");

function updateBest() {
  if (
    parseInt(localStorage.getItem("best")) > guesses ||
    localStorage.getItem("best") === "-1"
  ) {
    localStorage.setItem("best", guesses);
  }
}

function writeBest() {
  if (localStorage.getItem("best") === "-1") {
    bestScore.innerText = "You don't yet have a best score.";
  } else {
    bestScore.innerText = `In your best game, you matched all the cards in ${localStorage.getItem(
      "best"
    )} guesses.`;
  }
}

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  let id = 1;
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // give it a unique ID;
    newDiv.classList.add(id.toString());

    // create a span to put the ID in the div
    const idBox = document.createElement("span");
    idBox.innerText = id;
    idBox.classList.add("id");

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // put the ID at the top left;
    newDiv.append(idBox);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
    id++;
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  let clickedCard = event.target;
  if (cardsActive === 0 && !clickedCard.classList.contains("matched")) {
    cardsActive++;
    candidateID = clickedCard.classList.item(1);
    clickedCard.classList.add("faceup");
    // console.log("First candidate card: ", clickedCard);
  }
  if (
    cardsActive === 1 &&
    !clickedCard.classList.contains("matched") &&
    clickedCard.classList.item(1) !== candidateID
  ) {
    guesses++;
    cardsActive++;
    // console.log("Second candidate card: ", clickedCard);
    let activeCard = document.querySelector(".faceup");
    // console.log("Comparing against: ", activeCard);
    clickedCard.classList.add("faceup");

    if (activeCard.classList.item(0) === clickedCard.classList.item(0)) {
      // console.log("Match!");
      activeCard.classList.remove("faceup");
      activeCard.classList.add("matched");
      clickedCard.classList.remove("faceup");
      clickedCard.classList.add("matched");
      cardsActive = 0;
      matches++;

      if (matches === 1) {
        matchCounter.innerText = `You've made 1 match.`;
      } else if (matches === 5) {
        matchCounter.innerText = "You've made 5 matches. You win!";
        updateBest();
        writeBest();
        resetButton.classList.toggle("hidden");
      } else {
        matchCounter.innerText = `You've made ${matches} matches.`;
      }
    } else {
      // console.log("No match...");
      setTimeout(function () {
        activeCard.classList.remove("faceup");
        clickedCard.classList.remove("faceup");
        cardsActive = 0;
      }, 1500);
    }
    if (guesses === 1) {
      guessCounter.innerText = `You've made 1 guess.`;
    } else {
      guessCounter.innerText = `You've made ${guesses} guesses.`;
    }
  }
  // console.log(cardsActive);
}

resetButton.addEventListener("click", function (e) {
  resetButton.classList.toggle("hidden");
  matches = 0;
  guesses = 0;
  id = 0;
  gameContainer.innerHTML = "";
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  matchCounter.innerText = "You've made 0 matches.";
  guessCounter.innerText = "You've made 0 guesses.";
});

// when the DOM loads
createDivsForColors(shuffledColors);
writeBest();
