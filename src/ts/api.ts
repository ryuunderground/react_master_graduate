import axios from "axios";
import { AxiosResponse } from "axios";
interface IPrices {
  close: string;
  high: string;
  low: string;
  market_cap: number;
  open: string;
  time_close: number;
  time_open: number;
  volume: string;
}

export const coinFetcher = async () => {
  const res = await axios("https://api.coinpaprika.com/v1/coins");
  const resHundred = res.data.slice(0, 100);
  return resHundred;
};

export const priceFetcher = async (
  coinId: string | undefined
): Promise<IPrices[]> => {
  const priceRes: AxiosResponse<IPrices[]> = await axios(
    `https://ohlcv-api.nomadcoders.workers.dev?coinId=${coinId}`
  );
  return priceRes.data;
};

export const historyFetcher = async (coinId: string) => {
  const historyRes = await axios(
    `https://ohlcv-api.nomadcoders.workers.dev?coinId=${coinId}`
  );
  return historyRes.data;
};

export const coinInfoFetcher = async (coinId: string) => {
  const coinRes = await axios(`https://api.coinpaprika.com/v1/coins/${coinId}`);
  return coinRes.data;
};
