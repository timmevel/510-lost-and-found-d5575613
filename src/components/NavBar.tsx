import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-white shadow-sm mb-8">
      <div className="container mx-auto px-4 py-2 flex justify-center items-center">
        <Link to="/">
          <img 
            src="/510-logo.png" 
            alt="510 Training Club" 
            className="h-8 w-auto object-contain py-2.5"
          />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;