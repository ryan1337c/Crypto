import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("usd");
  const [symbol, setSymbol] = useState("$");

  useEffect(() => {
    if (currency === "usd") setSymbol("$");
    else if (currency === "eur") setSymbol("€");
  }, [currency]);

  return (
    <Crypto.Provider value={{ currency, symbol, setCurrency }}>
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
