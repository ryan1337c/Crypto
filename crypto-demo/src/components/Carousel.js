import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrendingCoins } from "../config/api";
import { CryptoState } from "../CryptoContext";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css"; // For our carousel
import { Link } from "react-router-dom";

export function numberWithCommas(x) {
  return x.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

const Carousel = () => {
  const [trending, setTrending] = useState([]);
  const { currency, symbol } = CryptoState();

  const fetchTrendingCoin = async () => {
    try {
      const { data } = await axios.get(TrendingCoins(currency));
      setTrending(data);
    } catch (error) {
      console.log("Error trying to fetch Trending Coins", error.message);
    }
  };

  useEffect(() => {
    fetchTrendingCoin();
  }, [currency]);

  // carousel variables
  const items = trending.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0;

    return (
      <Link className="carouselItem" to={`/coin/${coin.id}`}>
        <img
          src={coin?.image}
          alt={coin.name}
          height="80"
          style={{ marginBottom: 10 }}
        ></img>
        <span>
          {coin?.symbol}
          &nbsp;
          <span
            style={{
              color: profit > 0 ? "rgb(14, 203, 129)" : "red",
              fontWeight: 500,
            }}
          >
            {profit && "+"} {coin?.price_change_percentage_24h?.toFixed(2)}
          </span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 500 }}>
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });
  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <div className="carousel">
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </div>
  );
};

export default Carousel;
