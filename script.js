class Cards {
  constructor() {
    this.deck = [];
    this.total = 0;
    this.hand = [];
    this.hiddenTotal = 0;

    const cardNames = "A,2,3,4,5,6,7,8,9,10,J,Q,K".split(",");
    const cardTypes = ["Spades", "Clubs", "Hearts", "Diamonds"];

    for (let typeIndex = 0; typeIndex < cardTypes.length; typeIndex++) {
      for (let nameIndex = 0; nameIndex < cardNames.length; nameIndex++) {
        const card = {
          name: `${cardTypes[typeIndex]}_${cardNames[nameIndex]}`,
          index: nameIndex,
          type: typeIndex,
        };

        if (nameIndex === 0) {
          card.value = 11;
        } else if (nameIndex >= 10) {
          card.value = 10;
        } else {
          card.value = nameIndex + 1;
        }

        this.deck.push(card);
      }
    }

    this.shuffle();

    this.addCard();
    this.addCard();
  }

  shuffle() {
    const deck = this.deck;
    let currentIndex = deck.length;
    let randomIndex, temporaryValue;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      temporaryValue = deck[currentIndex];
      deck[currentIndex] = deck[randomIndex];
      deck[randomIndex] = temporaryValue;
    }
  }

  addCard() {
    const card = this.deck[0];
    this.deck.shift();

    const cardElement = document.createElement("div");

    cardElement.classList.add("card");
    cardElement.id = card.name;

    cardElement.setAttribute("data-value", card.value);
    cardElement.setAttribute("title", card.name);
    cardElement.style.setProperty("--i", card.index);
    cardElement.style.setProperty("--t", card.type);

    const frontElement = document.createElement("div");
    const backElement = document.createElement("div");
    frontElement.classList.add("front");
    backElement.classList.add("back");

    cardElement.appendChild(frontElement);
    cardElement.appendChild(backElement);

    document.getElementById("cards").appendChild(cardElement);

    var ths = this;

    this.hiddenTotal += card.value;

    cardElement.addEventListener("mouseover", function () {
      if (!Array.from(this.classList).includes("read")) {
        ths.total += card.value;

        if (ths.total > 21 && card.value === 11) {
          card.value = 1;
          ths.hiddenTotal = ths.hiddenTotal - 10;
          ths.total = ths.total - 10;
        }


        document.querySelector(".total").innerHTML =
          ths.total + " POINTS";
        this.classList.add("read");
      }
    });

    this.hand.push(card);
  }
}

const cards = new Cards();
