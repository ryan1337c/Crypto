import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SingleCoin } from "../config/api";
import { CryptoState } from "../CryptoContext";
import {
  createTheme,
  ThemeProvider,
  Container,
  Typography,
  LinearProgress,
} from "@mui/material";
import { numberWithCommas } from "../components/CoinsTable";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CoinInfo from "../components/CoinInfo";

const Coinpage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const { currency, symbol, setCurrency } = CryptoState();
  const [profit, setProfit] = useState(0);
  const [popupId, setPopupID] = useState();

  // theme
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      secondary: {
        main: "#ff9100",
      },
      mode: "dark",
    },
  });

  const handleOnClick = (id) => {
    if (popupId == null) setPopupID(id);
    else setPopupID();
  };

  const fetchCoin = async () => {
    try {
      const { data } = await axios.get(SingleCoin(id), {
        header: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      setCoin(data);

      console.log(data);
    } catch (error) {
      console.log(
        `Error in trying to fetch ${id} info from api`,
        error.message
      );
    }
  };

  useEffect(() => {
    fetchCoin();
  }, []);

  useEffect(() => {
    if (coin) {
      const profitValue =
        coin?.market_data.price_change_percentage_24h_in_currency[currency];
      setProfit(profitValue || 0);
    }
  }, [coin, currency]);

  if (!coin) return <LinearProgress style={{ background: "orange" }} />;

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="coinPage-main-container">
        <Container
          style={{
            fontFamily: "Fira Sans",
            marginTop: "50px",
            width: "auto",
          }}
        >
          <Typography
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={coin?.image.small}
              alt={coin?.name}
              style={{ marginBottom: 10 }}
            />
            <Typography
              fontWeight="bold"
              variant="h6"
              style={{
                marginLeft: 10,
                display: "flex",
                gap: "5px",
              }}
            >
              {coin?.name}
              <Typography
                style={{
                  paddingTop: "7px",
                  fontWeight: "normal",
                  fontSize: "15px",
                }}
              >
                {coin?.symbol.toUpperCase() + " Price"}
                <span
                  style={{ paddingLeft: "20px" }}
                >{`#${coin?.market_cap_rank}`}</span>
              </Typography>
            </Typography>
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>
              {symbol}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </span>
            <span
              style={{
                marginLeft: "10px",
                fontSize: "20px",
                color: profit > 0 ? "rgb(14,203,129)" : "red",
              }}
            >
              {profit > 0 && "+"}
              {profit.toFixed(2) + "%"}
            </span>
          </Typography>
          <table className="coin-stats">
            {[
              {
                label: "Market Cap",
                value: coin?.market_data.market_cap[currency],
                description:
                  "Market Cap = Current Price x Circulating Supply\n\nRefers to the total market value of a cryptocurrency’s circulating supply. It is similar to the stock market’s measurement of multiplying price per share by shares readily available in the market (not held & locked by insiders, governments)",
                id: "marketCap",
              },
              {
                label: "Fully Diluted Valuation",
                value: coin?.market_data.fully_diluted_valuation[currency],
                description:
                  "Fully Diluted Valuation (FDV) = Current Price x Total Suppl\nRefers to the total market value of a cryptocurrency’s circulating supply. It is similar to the stock market’s measurement of multiplying price per share by shares readily available in the market (not held & locked by insiders, governments)",
                id: "fdv",
              },
              {
                label: "24 Hour Trading Vol",
                value: coin?.market_data.total_volume[currency],
                description:
                  "A measure of a cryptocurrency trading volume across all tracked platforms in the last 24 hours. This is tracked on a rolling 24-hour basis with no open/closing times.",
                id: "tradingVol",
              },
              {
                label: "Circulating Supply",
                value: coin?.market_data.circulating_supply,
                description:
                  "The amount of coins that are circulating in the market and are tradeable by the public. It is comparable to looking at shares readily available in the market (not held & locked by insiders, governments).",
                id: "circSupply",
              },
              {
                label: "Total Supply",
                value: coin?.market_data.total_supply,
                description:
                  "The amount of coins that have already been created, minus any coins that have been burned (removed from circulation). It is comparable to outstanding shares in the stock market.\nTotal Supply = Onchain supply - burned tokens",
                id: "totalSupply",
              },
              {
                label: "Max Supply",
                value: coin?.market_data.max_supply,
                description:
                  "The maximum number of coins coded to exist in the lifetime of the cryptocurrency. It is comparable to the maximum number of issuable shares in the stock market.\nMax Supply = Theoretical maximum as coded",
                id: "maxSupply",
              },
            ].map((item) => (
              <tr key={item.id}>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    position: "relative",
                  }}
                >
                  {item.label}
                  <InfoOutlinedIcon
                    fontSize="small"
                    onClick={() => handleOnClick(item.id)}
                  />
                  {popupId === item.id && (
                    <div className="pop-up">{item.description}</div>
                  )}
                </td>
                <td>
                  {!item.value ? (
                    <div>Undefined</div>
                  ) : (
                    <>
                      {symbol}
                      {numberWithCommas(item.value)}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </table>
        </Container>
        <CoinInfo coin={coin} />
      </div>
    </ThemeProvider>
  );
};

export default Coinpage;
