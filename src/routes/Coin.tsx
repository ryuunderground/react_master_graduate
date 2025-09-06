import { useParams, Outlet, Link, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useLocation, useMatch } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { priceFetcher, coinInfoFetcher } from "../ts/api";
import { Helmet } from "react-helmet";

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

interface RouterState {
  name: string;
}

interface ICoinInfo {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

const Container = styled.div`
  padding: 0 20px;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 48px;
`;

const LoadingText = styled.h1`
  color: ${(props) => props.theme.textColor};
  font-size: 36px;
  text-align: center;
  margin-top: 24px;
`;

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
  color: ${(props) => props.theme.textColor};
`;

const Navs = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 52%;
  a {
    color: white;
    width: 45%;
  }
`;
const Nav = styled.li<{ isActive: boolean }>`
  display: flex;
  background-color: ${(props) => props.theme.blockColor};
  height: 36px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
`;

const PriceTitle = styled.h2`
  font-size: 18px;
`;
const ContentPrice = styled.span`
  font-size: 24px;
`;

const GoBack = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  height: 10vh;
  color: ${(props) => props.theme.blockColor};
  position: absolute;
  left: 20px;
  top: 0;
`;

const Coin = () => {
  const { coinId } = useParams();
  const location = useLocation();
  const states = location.state as RouterState;
  const priceMatch = useMatch("/react_master/:coinId/price");
  const chartMatch = useMatch("/react_master/:coinId/chart");

  const { isLoading: isPriceLoading, data: priceData } = useQuery<IPrices[]>(
    coinId ?? "defaultCoinId",
    () => priceFetcher(coinId),
    {
      enabled: !!coinId, // coinId가 있을 때만 쿼리 실행
      refetchInterval: 5000,
    }
  );

  const { isLoading: isCoinInfoLoading, data: coinInfo } = useQuery<ICoinInfo>(
    ["coinInfo", coinId],
    () => coinInfoFetcher(coinId!),
    {
      enabled: !!coinId,
    }
  );

  if (!priceData || priceData.length === 0)
    return <div>Coin data is loading...</div>;

  return (
    <Container>
      <Helmet>
        <title>{coinInfo?.name || states?.name || "Loading...."}</title>
      </Helmet>
      <Header>
        <Link to="/react_master">
          <GoBack>&lt;</GoBack>
        </Link>
        <Title>{coinInfo?.name || states?.name || "Loading...."}</Title>
      </Header>
      {isPriceLoading ? (
        <LoadingText>Loading....</LoadingText>
      ) : (
        <Main>
          <h2>Latest Price</h2>
          {priceData.slice(0, 1).map((info) => (
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

          <Navs>
            <Link to={`/react_master/${coinId}/chart`}>
              <Nav isActive={chartMatch !== null}>Chart</Nav>
            </Link>
            <Link to={`/react_master/${coinId}/price`}>
              <Nav isActive={priceMatch !== null}>Price</Nav>
            </Link>
          </Navs>

          <Outlet
            context={{
              coinId: coinId,
              coinName: coinInfo?.name || states?.name,
            }}
          />
        </Main>
      )}
    </Container>
  );
};

export default Coin;
