import { Button } from "../ui/button";

interface AdminHeaderProps {
  onAddClick: () => void;
}

const AdminHeader = ({ onAddClick }: AdminHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Admin</h1>
      <Button onClick={onAddClick}>Ajouter un objet</Button>
    </div>
  );
};

export default AdminHeader;