import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import {
  Container,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";

const Header = () => {
  const navigate = useNavigate();
  const { currency, setCurrency, chain, setChain } = CryptoState();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  useEffect(() => {
    // Chains fetched from birdeye only supports usd currency
    if (chain !== "ALL CHAINS" && currency !== "usd") setCurrency("usd");
  }, [chain]);

  const handleOnClick = () => {
    setChain("ALL CHAINS");
    navigate("/");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        {/*Container allows for auto adjustment during window resizing*/}
        <Container>
          <Toolbar>
            <Typography
              onClick={() => handleOnClick()}
              className="title"
              fontWeight="bold"
              variant="h6"
              style={{
                fontFamily: "Fira Sans",
              }}
            >
              Crypto Demo
            </Typography>
            <Select
              variant="outlined"
              style={{
                width: 100,
                height: 40,
                marginRight: 15,
              }}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value={"usd"}>USD</MenuItem>
              <MenuItem value={"eur"} disabled={chain != "ALL CHAINS"}>
                EURO
              </MenuItem>
            </Select>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
