import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PokedexListPage from "./pages/PokedexListPage";
import MyCollectionPage from "./pages/MyCollectionPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/Pokedex" element={<PokedexListPage />} />
        <Route path="/MyCollection" element={<MyCollectionPage />} />
      </Routes>
    </>
  );
}

export default App;
