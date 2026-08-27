const GachaGames = [
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
    api: "https://sg-public-api.hoyolab.com/event/luna/zzz/os/sign",
    actId: "e202406031448091",
    iconUrl: "img/zzz.png",
  },
  // {
  //   name: "Arknights Endfield",
  //   api: "https://zonai.skport.com/web/v1/game/endfield/attendance",
  //   iconUrl:
  //     "https://play-lh.googleusercontent.com/l6FVNa293RykBWy88TqEhUakIcGSC8bRygSnKOBgztln48JX-WzMWnrBAETrKZsxDNC4HhwCsvfle_UI7rBE=s48-rw",
  // },
];

chrome.action.setIcon({ path: "img/icon.png" });

chrome.runtime.onStartup.addListener(() => {
  handleStartupCheckIn();
});

chrome.action.onClicked.addListener((tab) => {
  setTimeout(onClick, 5000);
});

const checkIn = async (game) => {
  try {
    const zzzHeaders = new Headers();
    if (game.name === "Zenless Zone Zero") {
      zzzHeaders.append("x-rpc-signgame", "zzz");
    }

    const response = await fetch(game.api, {
      headers: zzzHeaders,
      method: "POST",
      body: JSON.stringify({ act_id: game.actId }),
    });
    console.log(await response.text());

    // chrome.notifications.create(
    //   game.name,
    //   {
    //     type: "basic",
    //     iconUrl: game.iconUrl,
    //     title: game.name,
    //     message: "Check In Done, login and get your rewards!",
    //   },
    //   function () {},
    // );
  } catch (e) {
    console.error(`Check-in ${game.name} error: ${e.message}`);
    setTimeout(onload, TIMEOUT);
  }
};

const onClick = async () => {
  for (const game of GachaGames) {
    await checkIn(game);
  }
};

async function handleStartupCheckIn() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  const { lastedDate } = new Date(await chrome.storage.local.get("lastedDate"));

  if (lastedDate !== today) {
    setTimeout(onClick, 5000);
    await chrome.storage.local.set({ lastedDate: today });
    await logMessage("Check-in completed for all games on startup.");
  } else {
    await logMessage("Check-in already done for today. No action taken.");
  }
}
async function logMessage(msg) {
  const timestamp = new Date().toLocaleString();
  const newEntry = `[${timestamp}] ${msg}`;

  const { logs = [] } = await chrome.storage.local.get("logs");
  logs.push(newEntry);

  // Keep only the last 50 entries
  if (logs.length > 50) logs.shift();

  await chrome.storage.local.set({ logs });
  console.log(newEntry);
}
