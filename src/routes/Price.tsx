import { useParams, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";
import { priceFetcher } from "../ts/api";

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

interface ICoinData {
  coinId: string;
  coinName?: string;
}

const Main = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  min-height: 40vh;
`;
const PriceList = styled.ul`
  display: flex;
  justify-content: center;
  width: 80%;
  height: 100%;
  gap: 48px;
`;

const PriceContent = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background-color: ${(props) => props.theme.blockColor};
  padding: 18px;
  border-radius: 5px;
`;

const PriceTitle = styled.h2`
  font-size: 18px;
`;
const ContentPrice = styled.span`
  font-size: 24px;
`;

const Price = () => {
  const { coinId } = useParams();
  const coinData = useOutletContext<ICoinData>();
  const coinName = coinData.coinName;
  const { isLoading: isPriceLoading, data: priceData } = useQuery<IPrices[]>(
    coinId ?? "defaultCoinId",
    () => priceFetcher(coinId),
    {
      enabled: !!coinId, // coinId가 있을 때만 쿼리 실행
      refetchInterval: 5000,
    }
  );

  if (!priceData || priceData.length === 0)
    return <div>Coin data is loading...</div>;
  return (
    <Main>
      <h2>{coinName} Previous Price</h2>
      {priceData.slice(1, -1).map((info) => (
        <PriceList>
          <PriceContent>
            <PriceTitle>close :</PriceTitle>
            <ContentPrice>{info.close}</ContentPrice>
          </PriceContent>
          <PriceContent>
            <PriceTitle>open :</PriceTitle>
            <ContentPrice>{info.open}</ContentPrice>
          </PriceContent>
          <PriceContent>
            <PriceTitle>high :</PriceTitle>
            <ContentPrice>{info.high}</ContentPrice>
          </PriceContent>
          <PriceContent>
            <PriceTitle>low :</PriceTitle>
            <ContentPrice>{info.low}</ContentPrice>
          </PriceContent>
        </PriceList>
      ))}
    </Main>
  );
};

export default Price;
