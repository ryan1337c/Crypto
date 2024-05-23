import React from "react";
import { Container, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { HistoricalChart } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { timeFrameOptions } from "../config/data";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x-axis
  LinearScale, // y-axis
  PointElement,
  Legend,
  Colors,
  Tooltip,
} from "chart.js";
import { CircularProgress } from "@mui/material";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Colors,
  Tooltip
);

ChartJS.defaults.color = "#fff";

const CoinInfo = ({ coin }) => {
  const [timeFrame, setTimeFrame] = useState(1);
  const [historicData, setHistoricData] = useState();
  const { currency } = CryptoState();
  const [loading, setLoading] = useState(false);

  const fetchCoinHistory = async () => {
    setLoading(true);
    const { data } = await axios.get(
      HistoricalChart(coin.id, timeFrame, currency)
    );
    setHistoricData(data.prices);
    console.log(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoinHistory();
  }, [timeFrame, currency]);

  const chartTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
    },
  });

  const getLabel = () => {
    if (timeFrame === 1) return "day";
    else if (timeFrame === 7) return "week";
    else if (timeFrame === 30) return "month";
    else if (timeFrame === 90) return "3 months";
    else if (timeFrame === 365) return "year";
  };

  return (
    <ThemeProvider theme={chartTheme}>
      <Container
        style={{
          padding: "0",
          width: "100%",
        }}
      >
        {!historicData | loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "15%",
            }}
          >
            <CircularProgress sx={{ color: "#ff9100" }} size="7rem" />
          </div>
        ) : (
          <>
            <div className="timeFrames-container">
              {timeFrameOptions.map((timeFrame) => {
                return (
                  <button
                    className="timeFrames"
                    key={timeFrame}
                    onClick={() => setTimeFrame(timeFrame.value)}
                  >
                    {timeFrame.label}
                  </button>
                );
              })}
            </div>

            <div className="canvas-container">
              <Line
                data={{
                  labels: historicData?.map((coin) => {
                    let date = new Date(coin[0]); // coin[0] = the exact date
                    let time =
                      date.getHours() > 12
                        ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                        : `${date.getHours()}:${date.getMinutes()} AM`;
                    return timeFrame === 1 ? time : date.toLocaleDateString();
                  }),
                  datasets: [
                    {
                      label: `Price action in the past ${getLabel()}`,
                      data: historicData.map((coin) => {
                        return `${coin[1]}`;
                      }),
                      borderColor: "orange",
                    },
                  ],
                }}
                options={{
                  elements: {
                    point: {
                      radius: 1,
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default CoinInfo;
