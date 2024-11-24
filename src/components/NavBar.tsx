import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-16">
          <Link to="/" className="py-[10px]">
            <img
              src="/510-training-club-logo.png"
              alt="510 Training Club"
              className="h-12 w-auto"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;