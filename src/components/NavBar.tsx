import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-white shadow-sm mb-8">
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="inline-block">
          <img 
            src="/510-training-club-logo.png" 
            alt="510 Training Club" 
            className="h-12"
          />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;