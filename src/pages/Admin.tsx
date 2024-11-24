import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Admin = () => {
  const { items, fetchItems, updateItemStatus, addItem } = useStore();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    description: "",
    image: null as File | null,
  });

  useEffect(() => {
    fetchItems().catch(console.error);
  }, [fetchItems]);

  const handleAddItem = async () => {
    if (!newItem.description || !newItem.image) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    try {
      await addItem({
        description: newItem.description,
        image: newItem.image,
      });
      
      setNewItem({ description: "", image: null });
      setIsAddingItem(false);
      toast.success("Objet ajouté avec succès");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout de l'objet");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        <Button onClick={() => setIsAddingItem(true)}>Ajouter un objet</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Réservé par</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img
                    src={item.image_url}
                    alt={item.description}
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  {item.reserved_by_name ? (
                    <div>
                      <div>{item.reserved_by_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.reserved_by_email}
                      </div>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {item.status !== "Trouvé" && (
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          await updateItemStatus(item.id, "Trouvé");
                          toast.success("Objet marqué comme trouvé");
                        } catch (error) {
                          console.error(error);
                          toast.error("Erreur lors de la mise à jour du statut");
                        }
                      }}
                    >
                      Marquer comme trouvé
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel objet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    image: e.target.files?.[0] || null,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddItem}>Ajouter l'objet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;