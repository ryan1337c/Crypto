import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Homepage from "./Pages/Homepage";
import Coinpage from "./Pages/Coinpage";
import { styled } from "@mui/system";
function App() {
  //material UI
  const AppStyle = styled("div")({
    background: "#14161a",
    color: "white",
    minHeight: "100vh",
  });

  return (
    <BrowserRouter>
      <div className={AppStyle}></div>
      <AppStyle>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} exact />
          <Route path="/coins/:id" element={<Coinpage />} />
        </Routes>
      </AppStyle>
    </BrowserRouter>
  );
}

export default App;
