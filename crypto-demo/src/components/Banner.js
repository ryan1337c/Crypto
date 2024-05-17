import React from "react";
import { Container, Typography } from "@mui/material";
import Carousel from "./Carousel";
const Banner = () => {
  return (
    <div className="banner">
      <Container className="bannerContent">
        <div className="tagline">
          <Typography
            variant="h2"
            style={{
              fontWeight: "bold",
              marginBottom: 15,
              fontFamily: "Fira Sans",
            }}
          >
            Crypto
          </Typography>
          <Typography
            variant="subtitle2"
            style={{
              color: "darkgrey",
              textTransform: "capitalize",
              fontFamily: "Fira Sans",
            }}
          >
            Here you can find information regarding various crypto
          </Typography>
        </div>
        <Carousel />
      </Container>
    </div>
  );
};

export default Banner;
