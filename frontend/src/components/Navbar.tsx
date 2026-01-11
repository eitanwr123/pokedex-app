import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold cursor-pointer">
            Pokédex
          </Link>
          <div className="flex gap-6">
            <Link
              to="/Pokedex"
              className="hover:text-blue-200 transition font-medium"
            >
              Pokedex
            </Link>
            <Link
              to="/my-collection"
              className="hover:text-blue-200 transition font-medium"
            >
              My Collection
            </Link>
            <Link
              to="/chat"
              className="hover:text-blue-200 transition font-medium"
            >
              AI Chat
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
