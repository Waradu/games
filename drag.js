var cards = document.querySelectorAll(".card")
let mouseTimeout;

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

cards.forEach((card) => {
  var dragging = false
  var zIndex = 10

  var beforeX = 0
  var beforeY = 0

  console.log(card);

  card.addEventListener("mousedown", (e)=>{
    dragging = true;
    /* card.style.transform = "perspective(400px) rotateX(-60deg)" */
    card.style.left = (e.x - 20) + "px";
    card.style.top = (e.y - 30) + "px";
    card.style.position = "absolute"
    card.style.zIndex = zIndex++;
    card.classList.add("dragging")
    beforeX = e.x
    beforeY = e.y
  })

  async function handleMouseStop() {
    var matches = card.style.rotate.match(/\d+/);
    var intValue = parseInt(matches[0], 10);

    card.style.rotate = ""+(intValue/2)+"deg";

    await delay(100);

    var matches = card.style.rotate.match(/\d+/);
    var intValue = parseInt(matches[0], 10);

    card.style.rotate = ""+(intValue/2)+"deg";

    await delay(100);

    card.style.rotate = "0deg";
  }
  
  document.addEventListener("mousemove", (e)=>{
    if (dragging) {
      clearTimeout(mouseTimeout);

      card.classList.remove("dragging")
      card.style.left = (e.x - 20) + "px";
      card.style.top = (e.y - 30) + "px";

      var rotation = (e.x-beforeX)*3

      if (rotation > 50) rotation = 50
      if (rotation < -50) rotation = -50

      card.style.rotate = ""+rotation+"deg";

      beforeX = e.x
      beforeY = e.y

      mouseTimeout = setTimeout(handleMouseStop, 100);
    }
  })
  
  document.addEventListener("mouseup", (e)=>{
    if (dragging) {
      dragging = false;
      card.style.transform = "";
      card.classList.remove("dragging")
  
      card.style.rotate = "0deg"
    }
  })
})