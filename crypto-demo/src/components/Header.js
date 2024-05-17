import React from "react";
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
  const { currency, setCurrency } = CryptoState();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        {/*Container allows for auto adjustment during window resizing*/}
        <Container>
          <Toolbar>
            <Typography
              onClick={() => navigate("/")}
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
              <MenuItem value={"CAD"}>CAD</MenuItem>
              <MenuItem value={"USD"}>USD</MenuItem>
            </Select>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
