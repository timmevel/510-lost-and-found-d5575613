import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import AdminHeader from "@/components/admin/AdminHeader";
import ItemsTable from "@/components/admin/ItemsTable";
import AddItemDialog from "@/components/admin/AddItemDialog";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const { items, fetchItems, updateItemStatus, addItem, deleteItem, archiveItem } = useStore();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

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

  const handleStatusChange = async (id: string, status: any, retrievedBy?: { name: string; email: string }) => {
    try {
      await updateItemStatus(id, status, retrievedBy);
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

  const handleArchive = async (id: string) => {
    try {
      await archiveItem(id);
      toast.success("Objet archivé avec succès");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'archivage de l'objet");
    }
  };

  const filteredItems = items.filter(item => item.is_archived === showArchived);

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <AdminHeader onAddClick={() => setIsAddingItem(true)} />
          <Button
            variant="outline"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? "Voir les objets actifs" : "Voir les objets archivés"}
          </Button>
        </div>
        <ItemsTable
          items={filteredItems}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onArchive={handleArchive}
          showArchived={showArchived}
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