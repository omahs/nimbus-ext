import * as browser from "webextension-polyfill";
import { onMessage } from "webext-bridge";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { coinGeko } from '../contentScript/views/network';

browser.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

console.log(browser);

browser.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);
  const tabsQuery = browser.tabs.query({ active: true, currentWindow: true })
  if (command == "open-quick-search") {
    browser.tabs.sendMessage(tabsQuery[0].id, { action: "toggleSidebar" });
  }
});

const fetchBasicData = async () => {
  const list = await fetch("https://api.coingecko.com/api/v3/search").then(
    (response) => response.json()
  );
  console.log(browser.storage);
  browser.storage.local
    .set({ coinList: JSON.stringify(list.coins) })
    .then(() => {
      console.log("Loaded crypto list");
    });
};

const fetchConfigPages = async () => {
  const listConfigPages = await fetch("https://utils.getnimbus.xyz/config/pages").then((response) => response.json());
  browser.storage.local
    .set({ configPageList: JSON.stringify(listConfigPages.data) })
    .then(() => {
      console.log("Loaded config page list");
    });
};

const fetchSearchData = async (search) => {
  const list = await fetch(`https://api.coingecko.com/api/v3/search?query=${search}`).then((response) => response.json());
  return JSON.stringify(list.coins)
}

const fetchChartData = async (symbol) => {
  const params = {
    id: `${symbol}-chart`,
    params: {
      vs_currency: "usd",
      from: dayjs().subtract(7, "d").unix(),
      to: dayjs().unix(),
    },
  }
  const chart = await coinGeko.get(`coins/${symbol}/market_chart/range`, params).then(
    (response) => response
  );

  browser.storage.local
    .set({ [JSON.stringify(symbol)]: JSON.stringify(chart.data) })
    .then(() => {
      console.log("Loaded data chart");
    });

  return JSON.stringify(chart.data)
}

const fetchTokenInfo = async (id) => {
  const [priceData, coinData] = await Promise.all([
    coinGeko
      .get(`simple/price?ids=${id}&vs_currencies=usd`)
      .then((response) => response.data),
    coinGeko
      .get(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`
      )
      .then((response) => response.data),
  ]);

  browser.storage.local
    .set({
      [JSON.stringify(id + "_info")]: JSON.stringify(
        { priceData: priceData, coinData: coinData }
      ),
    })
    .then(() => {
      console.log("Loaded crypto info");
    });

  return JSON.stringify({ priceData: priceData, coinData: coinData })
}

browser.runtime.onStartup.addListener(async () => {
  console.log("onStartup....");
  await fetchBasicData();
  await fetchConfigPages();
});

interface ICoinListInput {
  limit: number;
}

interface ISearchInput {
  search: string;
}

interface ISymbolInput {
  symbol: string;
}

interface IIdInput {
  id: string
}

onMessage<ICoinListInput, any>("coinList", async ({ data: { limit } }) => {
  try {
    const data = JSON.parse(
      (await browser.storage.local.get("coinList")).coinList
    );
    return data.slice(0, limit);
  } catch (error) {
    return [];
  }
});

onMessage("configPageList", async () => {
  try {
    return JSON.parse(
      (await browser.storage.local.get("configPageList")).configPageList
    );
  } catch (error) {
    return [];
  }
});

onMessage<ISearchInput, any>("getSearchData", async ({ data: { search } }) => {
  try {
    const data = JSON.parse(await fetchSearchData(search))
    return data.slice(0, 5)
  } catch (e) {
    return [];
  }
});

onMessage<ISymbolInput, any>("chartDataLocal", async ({ data: { symbol } }) => {
  try {
    const dataLocal = await browser.storage.local.get(symbol)

    if (!isEmpty(dataLocal[symbol]) && dataLocal.hasOwnProperty(symbol)) {
      return dataLocal[symbol]
    }

  } catch (e) {
    return {};
  }
});

onMessage<ISymbolInput, any>("chartData", async ({ data: { symbol } }) => {
  try {
    return JSON.parse(await fetchChartData(symbol))
  } catch (e) {
    return {};
  }
});

onMessage<IIdInput, any>("tokenInfoData", async ({ data: { id } }) => {
  try {
    const key = id + "_info"
    const dataLocal = await browser.storage.local.get(key)

    if (!isEmpty(dataLocal) && dataLocal.hasOwnProperty(id + "_info")) {
      return JSON.parse(dataLocal[key])
    } else {
      return JSON.parse(await fetchTokenInfo(id))
    }
  } catch (e) {
    return {};
  }
});

// Run on init
fetchBasicData();
fetchConfigPages();
