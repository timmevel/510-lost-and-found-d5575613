import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const NavBar = () => {
  return (
    <nav className="bg-white shadow-sm mb-8">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-1" /> {/* Spacer */}
        <Link to="/" className="flex-1 flex justify-center">
          <img 
            src="/510-logo.png" 
            alt="510 Training Club" 
            className="h-12"
          />
        </Link>
        <div className="flex-1 flex justify-end">
          <Link to="/admin">
            <Button variant="outline">Admin</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;