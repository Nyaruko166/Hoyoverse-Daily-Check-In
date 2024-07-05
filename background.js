const MichosGames = [
  {
    name: "Honkai Impact 3",
    api: "https://sg-public-api.hoyolab.com/event/mani/sign",
    actId: "e202110291205111",
    iconUrl: "img/hi3.png",
  },
  {
    name: "Genshit Impact",
    api: "https://sg-hk4e-api.hoyolab.com/event/sol/sign",
    actId: "e202102251931481",
    iconUrl: "img/gens.png",
  },
  {
    name: "Honkai Star Rail",
    api: "https://sg-public-api.hoyolab.com/event/luna/os/sign",
    actId: "e202303301540311",
    iconUrl: "img/hsr.png",
  },
  {
    name: "Zenless Zone Zero",
    api: "https://sg-act-nap-api.hoyolab.com/event/luna/zzz/os/sign",
    actId: "e202406031448091",
    iconUrl: "img/zzz.png",
  },
];

var count = 0;

chrome.action.setIcon({ path: "img/icon.png" });

chrome.action.onClicked.addListener((tab) => {
  setTimeout(onClick, 5000);
});

const checkIn = async (game) => {
  if (Number(count) === 0) {
    chrome.notifications.create(
      "starting",
      {
        type: "basic",
        iconUrl: "img/icon.png",
        title: "Starting Checkin!!",
        message: "Wait till you get notifications!",
      },
      function () {}
    );
    count = 1;
  }

  try {
    const response = await fetch(game.api, {
      method: "POST",
      body: JSON.stringify({ act_id: game.actId }),
    });
    console.log(await response.text());

    chrome.notifications.create(
      game.name,
      {
        type: "basic",
        iconUrl: game.iconUrl,
        title: game.name,
        message: "Check In Done, login and get your rewards!",
      },
      function () {}
    );
  } catch (e) {
    console.error(`Check-in ${game.name} error: ${e.message}`);
    setTimeout(onload, TIMEOUT);
  }
};

const onClick = async () => {
  for (const game of MichosGames) {
    await checkIn(game);
  }
};
