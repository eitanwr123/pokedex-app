import { Route, Routes } from "react-router-dom";
import PokedexPage from "./pages/PokedexPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="text-4xl font-bold text-blue-600 mb-4">Home Page</div>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/pokedex" element={<PokedexPage />} />
    </Routes>
  );
}

export default App;
