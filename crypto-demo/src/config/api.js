// APIs from coin gecko
export const CoinList = (currency) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

export const SingleCoin = (id) =>
  `https://api.coingecko.com/api/v3/coins/${id}`;

export const CoinTickers = (id) =>
  `https://api.coingecko.com/api/v3/coins/${id}/tickers`;

export const HistoricalChart = (id, days = 365, currency) =>
  `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

export const TrendingCoins = (currency) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;

export const tokenList = {
  method: "GET",
  url: "https://public-api.birdeye.so/defi/tokenlist",
  params: {
    sort_by: "v24hUSD",
    sort_type: "desc",
    offset: "0",
    limit: "50",
    min_liquidity: "100",
  },
  headers: {
    accept: "application/json",
    "x-chain": "solana",
    "X-API-KEY": "94da69d50a564667b406914b06a88461",
  },
};

// export const tokenHistory = {
//   method: "GET",
//   url: "https://public-api.birdeye.so/defi/history_price",
//   params: {
//     address: "So11111111111111111111111111111111111111112",
//     address_type: "token",
//     type: "15m",
//   },
//   headers: {
//     accept: "application/json",
//     "x-chain": "solana",
//   },
// };
