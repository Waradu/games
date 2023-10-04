class Cards {
  constructor() {
    this.deck = [];
    this.total = 0;
    this.hand = [];
    this.dealerHand = [];
    this.dealerTotal = 0;

    this.hidden = true;

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
    
    this.addDealerCard();
    this.addDealerCard();

    this.addCard();
    this.addCard();

  }

  reset() {
    document.getElementById("dealerCards").innerHTML = "";
    document.getElementById("cards").innerHTML = `
    <div class="newcard" id="add">
        <span class="material-symbols-rounded">add</span>
      </div>
      <div class="newcard" id="done">
        <span class="material-symbols-rounded">check</span>
      </div>
    `;
    document.querySelector(".total").innerHTML = "Player: 0";
    document.querySelector(".total").style.color = "";
    document.querySelector(".dealertotal").innerHTML = "Dealer: 0";
    document.querySelector(".dealertotal").style.color = "";

    document.getElementById("add").addEventListener("click", () => {
      cards.addCard();
    });
    
    document.getElementById("done").addEventListener("click", () => {
      cards.checkFinish();
    
      document.getElementById("done").style.display = "none";
      document.getElementById("add").style.display = "none";
    });

    this.deck = [];
    this.total = 0;
    this.hand = [];
    this.dealerHand = [];
    this.dealerTotal = 0;

    this.hidden = true;

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
    
    this.addDealerCard();
    this.addDealerCard();

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

  addDealerCard() {
    var card = {};
    if (!this.hidden) {
      var card = this.deck[0];
      this.deck.shift();
    }

    const cardElement = document.createElement("div");

    cardElement.classList.add("card");
    cardElement.id = "Unknown";

    cardElement.setAttribute("title", "Hidden");
    if (!this.hidden) {
      cardElement.id = card.name;

      cardElement.setAttribute("title", card.name);
    }
    cardElement.style.setProperty("--i", card.index);
    cardElement.style.setProperty("--t", card.type);
    if (this.hidden) {
      cardElement.style.setProperty("--i", "15");
      cardElement.style.setProperty("--t", "0");
    }

    const frontElement = document.createElement("div");
    const backElement = document.createElement("div");
    frontElement.classList.add("front");
    backElement.classList.add("back");

    cardElement.appendChild(frontElement);
    cardElement.appendChild(backElement);

    document.getElementById("dealerCards").appendChild(cardElement);

    if (!this.hidden) {
      this.dealerHand.push(card);
    }

    if (!this.hidden) {
      this.dealerTotal += card.value;
      document.querySelector(".dealertotal").innerHTML =
        "Dealer: " + this.dealerTotal;
    }

    this.hidden = false;
  }

  checkFinish() {
    const card = this.deck[0];
    this.deck.shift();

    var hidden = document.getElementById("Unknown");
    hidden.style.setProperty("--i", card.index);
    hidden.style.setProperty("--t", card.type);

    hidden.id = card.name;

    this.dealerHand.push(card);

    this.dealerTotal += card.value;
    document.querySelector(".dealertotal").innerHTML =
      "Dealer: " + this.dealerTotal;

    this.checkDealer();
  }

  checkDealer() {
    if (this.total > 21) {
      this.dealerHand.forEach((card) => {
        if (card.value === 11 && this.dealerTotal > 21) {
          card.value = 1;
          this.dealerTotal -= 10;
        }
      });
    }

    while (this.dealerTotal < 17) {
      this.addDealerCard();

      if (this.total > 21) {
        this.dealerHand.forEach((card) => {
          if (card.value === 11 && this.dealerTotal > 21) {
            card.value = 1;
            this.dealerTotal -= 10;
          }
        });
      }
    }

    if (this.dealerTotal > 21) {
      document.querySelector(".dealertotal").style.color = "red";
    }
    document.querySelector(".dealertotal").innerHTML =
      "Dealer: " + this.dealerTotal;
  }

  addCard() {
    const card = this.deck[0];
    this.deck.shift();

    const cardElement = document.createElement("div");

    cardElement.classList.add("card");
    cardElement.id = card.name;

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

    this.total += card.value;

    this.hand.push(card);

    this.check();
  }

  check() {
    if (this.total === 21 && this.hand.length === 2) {
      document.querySelector(".total").innerHTML = "You: " + this.total;
      document.querySelector(".total").style.color = "green";
      document.getElementById("done").style.display = "none";
      document.getElementById("add").style.display = "none";
      this.checkFinish();

      return;
    } 

    
    if (this.total > 21) {
      this.hand.forEach((card) => {
        if (card.value === 11 && this.total > 21) {
          card.value = 1;
          this.total -= 10;
        }
      });
    }

    if (this.total > 21) {
      document.querySelector(".total").style.color = "red";
      document.getElementById("add").style.display = "none";
      cards.checkFinish();

      document.getElementById("done").style.display = "none";
      document.getElementById("add").style.display = "none";
    }
    document.querySelector(".total").innerHTML = "You: " + this.total;
  }
}

const cards = new Cards();

document.getElementById("add").addEventListener("click", () => {
  cards.addCard();
});

document.getElementById("done").addEventListener("click", () => {
  cards.checkFinish();

  document.getElementById("done").style.display = "none";
  document.getElementById("add").style.display = "none";
});

document.getElementById("restart").addEventListener("click", () => {
  cards.reset();
});