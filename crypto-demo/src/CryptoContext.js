import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("usd");
  const [symbol, setSymbol] = useState("$");
  const [chain, setChain] = useState("ALL CHAINS");
  const [tokenHistory, setTokenHistory] = useState({});
  const [coin, setCoin] = useState();

  useEffect(() => {
    if (chain !== "ALL CHAINS") {
      setSymbol("$");
    } else if (currency === "usd") setSymbol("$");
    else if (currency === "eur") setSymbol("€");
  }, [currency]);

  return (
    <Crypto.Provider
      value={{
        currency,
        symbol,
        chain,
        tokenHistory,
        coin,
        setCurrency,
        setChain,
        setTokenHistory,
        setCoin,
      }}
    >
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
