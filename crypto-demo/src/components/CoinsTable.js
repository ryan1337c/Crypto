import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CoinList } from "../config/api";
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
} from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import axios from "axios";

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
  const { currency, symbol } = CryptoState();

  const navigate = useNavigate();

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

  // fetch from api
  const fetchCoins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
    } catch (error) {
      console.log("Error trying to fetch coin list", error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchCoins();
  }, [currency]);

  const handleSearch = () => {
    return coins.filter((coin) => {
      return (
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
      );
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
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
                        key={{ head }}
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
                    const profit = row.price_change_percentage_24h > 0;
                    return (
                      <TableRow
                        onClick={() => navigate(`./coins/${row.id}`)}
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
                            src={row?.image}
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
                          {numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14,203,129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {profit && "+"}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          {symbol} {simplifyNumber(row.market_cap)}
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
