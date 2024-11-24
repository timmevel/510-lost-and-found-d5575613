import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: { description: string; image: File }) => Promise<void>;
}

const AddItemDialog = ({ isOpen, onClose, onAdd }: AddItemDialogProps) => {
  const [newItem, setNewItem] = useState({
    description: "",
    image: null as File | null,
  });

  const handleAdd = async () => {
    if (!newItem.description || !newItem.image) {
      return;
    }

    await onAdd(newItem);
    setNewItem({ description: "", image: null });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          <Button onClick={handleAdd}>Ajouter l'objet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;