import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import AdminHeader from "@/components/admin/AdminHeader";
import ItemsTable from "@/components/admin/ItemsTable";
import AddItemDialog from "@/components/admin/AddItemDialog";

const Admin = () => {
  const { items, fetchItems, updateItemStatus, addItem, deleteItem } = useStore();
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    fetchItems().catch(console.error);
  }, [fetchItems]);

  const handleAddItem = async (item: { description: string; image: File }) => {
    try {
      await addItem(item);
      toast.success("Objet ajouté avec succès");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout de l'objet");
    }
  };

  const handleStatusChange = async (id: string, status: any) => {
    try {
      await updateItemStatus(id, status);
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast.success("Objet supprimé avec succès");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression de l'objet");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <AdminHeader onAddClick={() => setIsAddingItem(true)} />
        <ItemsTable
          items={items}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
        <AddItemDialog
          isOpen={isAddingItem}
          onClose={() => setIsAddingItem(false)}
          onAdd={handleAddItem}
        />
      </div>
    </div>
  );
};

export default Admin;