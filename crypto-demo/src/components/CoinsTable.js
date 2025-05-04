import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CoinList, tokenList } from "../config/api";
import { CryptoState } from "../CryptoContext";
import {
  Typography,
  createTheme,
  Container,
  TextField,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  LinearProgress,
  Pagination,
  tableRowClasses,
} from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import axios from "axios";
import "./styles.css";

export function numberWithCommas(x) {
  if (x == null) return "";
  return x.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

export function simplifyNumber(x) {
  const oneTrillion = 1000000000000;
  const oneBillion = 1000000000;
  const oneMillion = 1000000;
  if (x > oneTrillion) return (x / oneTrillion).toFixed(2) + "T";
  else if (x > oneBillion) return (x / oneBillion).toFixed(2) + "B";
  else if (x > oneMillion) return (x / oneMillion).toFixed(2) + "M";
  else return numberWithCommas(x);
}

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { currency, symbol, chain, setChain, setTokenHistory } = CryptoState();

  const navigate = useNavigate();

  // api objects init
  const [localTokenList, setLocalTokenList] = useState(tokenList);

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

  // chain list
  const chains = [
    "ALL CHAINS",
    "SOLANA",
    "SUI",
    "ETHEREUM",
    "BNB CHAIN",
    "ARBITRUM",
    "AVALANCHE",
    "BASE",
    "OPTIMISM",
    "POLYGON",
  ];

  // fetch from coin gecko api
  const fetchCoins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(CoinList(currency), {
        header: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      setCoins(data);
      console.log(data);
    } catch (error) {
      console.log("Error trying to fetch coin list", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Clear the coins data when the chain changes to avoid displaying outdated data
    setCoins([]);
    if (chain !== "ALL CHAINS") {
      // Update list to the chosen chain
      setLocalTokenList((prev) => ({
        ...prev,
        headers: {
          ...prev.headers,
          "x-chain": chain.toLowerCase(),
        },
      }));
    } else fetchCoins();
  }, [chain, currency]);

  useEffect(() => {
    // Only call fetchTokensForChain when localTokenList is updated
    if (chain !== "ALL CHAINS") {
      fetchTokensForChain();
    }
  }, [localTokenList]); // Triggered when localTokenList state is updated

  const handleSearch = () => {
    if (!Array.isArray(coins)) return []; // Ensure coins is always an array
    return coins.filter((coin) => {
      return (
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
      );
    });
  };

  // Fetch Tokens from a chain
  const fetchTokensForChain = async () => {
    setLoading(true);
    // Get Token/Coin List on specific chain
    try {
      const tokenResponse = await axios(localTokenList, {
        header: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      console.log("Fetched tokens for chain:", tokenResponse.data);
      setCoins(tokenResponse.data.data.tokens);
    } catch (err) {
      console.error("Error fetching chain specific tokens: ", err);
    }

    setLoading(false);
  };

  const handleOnClick = async (coin) => {
    navigate(
      `./coins/${
        coin?.id ?? (coin.name ?? "").toLowerCase().replace(/\s+/g, "-")
      }`
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div>
        <div className="grid-container">
          {chains.map((ch, index) => (
            <div
              key={index}
              className="grid-item"
              style={{ color: chain === ch ? "orange" : "" }}
              onClick={() => setChain(ch)}
            >
              {ch}
            </div>
          ))}
        </div>
      </div>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h2"
          style={{
            margin: 18,
            fontFamily: "Fira Sans",
          }}
        >
          Crypto Market Today
        </Typography>
        <TextField
          id="search-bar"
          label="Search"
          variant="outlined"
          style={{
            width: "100%",
            marginBottom: 20,
          }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "orange" }} />
          ) : (
            <Table>
              <TableHead style={{ backgroundColor: "orange" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((head) => {
                    return (
                      <TableCell
                        style={{
                          color: "black",
                          fontWeight: "700",
                          fontFamily: "Montserrat",
                        }}
                        key={head}
                        align={head === "Coin" ? "" : "right"}
                      >
                        {head}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit =
                      row?.price_change_percentage_24h > 0 ||
                      row?.v24hChangePercent > 0;
                    return (
                      <TableRow
                        onClick={() => handleOnClick(row)}
                        className="row"
                        key={row.name}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                          }}
                        >
                          <img
                            src={row?.image || row?.logoURI}
                            alt={row.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: "darkgrey" }}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(
                            (row?.current_price ?? row?.price ?? 0).toFixed(2)
                          )}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14,203,129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {profit && "+"}
                          {(
                            row?.price_change_percentage_24h ??
                            row?.v24hChangePercent ??
                            0
                          )?.toFixed(2)}
                          %
                        </TableCell>
                        <TableCell align="right">
                          {symbol} {simplifyNumber(row?.market_cap || row?.mc)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          style={{
            padding: "20px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          count={(handleSearch().length / 10).toFixed(0)}
          color="secondary"
          onChange={(_, pageNumber) => {
            setPage(pageNumber);
          }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
