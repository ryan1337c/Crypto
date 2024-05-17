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
  CircularProgress,
  Box,
} from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import axios from "axios";

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const { currency } = CryptoState();

  const navigate = useNavigate();

  // theme
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  const handleSearch = () => {
    return coins.filter((coin) => {
      coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search);
    });
  };

  // fetch from api
  const fetchCoins = async () => {
    setLoading(true);
    try {
      const { data } = axios.get(CoinList(currency));
      setCoins(data);
    } catch (error) {
      console.log("Error in trying to fetch list of coins", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, [currency]);

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
            <Box sx={{ display: "flex" }}>
              <CircularProgress style={{ backgroundColor: "gold" }} />
            </Box>
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
                {handleSearch().map((row) => {
                  const profit = row.price_change_percentage_24h > 0;
                  return (
                    <TableRow onClick={() => navigate(`./coins/${row.id}`)}>
                      {}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
