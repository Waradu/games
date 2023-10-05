class Chips {
  constructor() {
    this.normalChips = [
      {
        color: "Lime",
        value: 1,
        valueName: ""
      },
      {
        color: "Blue",
        value: 5,
        valueName: ""
      },
      {
        color: "Red",
        value: 10,
        valueName: ""
      },
      {
        color: "Black",
        value: 50,
        valueName: ""
      },
      {
        color: "Yellow",
        value: 500,
        valueName: ""
      },
      {
        color: "Lavender",
        value: 2,
        valueName: "K"
      },
      {
        color: "Dark Blue",
        value: 10,
        valueName: "K"
      },
      {
        color: "Dark Cyan",
        value: 100,
        valueName: "K"
      },
      {
        color: "Black Coral",
        value: 1,
        valueName: "M"
      },
      {
        color: "Magenta",
        value: 50,
        valueName: "M"
      }
    ];

    document.querySelectorAll(".indicator").forEach((indicator, index) => {
      indicator.dataset.text = this.normalChips[index].color+" "+this.normalChips[index].value+this.normalChips[index].valueName;
    })
  }
}

var chips = new Chips();