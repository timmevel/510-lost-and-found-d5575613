import { useState } from "react";
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
  const { items, updateItemStatus, addItem } = useStore();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    description: "",
    imageUrl: "",
  });

  const handleAddItem = () => {
    if (!newItem.description || !newItem.imageUrl) {
      toast.error("Please fill in all fields");
      return;
    }
    
    addItem({
      ...newItem,
      status: "Lost",
    });
    
    setNewItem({ description: "", imageUrl: "" });
    setIsAddingItem(false);
    toast.success("Item added successfully");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => setIsAddingItem(true)}>Add Item</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reserved By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img
                    src={item.imageUrl}
                    alt={item.description}
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  {item.reservedBy ? (
                    <div>
                      <div>{item.reservedBy.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.reservedBy.email}
                      </div>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {item.status !== "Found" && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        updateItemStatus(item.id, "Found");
                        toast.success("Item marked as found");
                      }}
                    >
                      Mark as Found
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
            <DialogTitle>Add New Item</DialogTitle>
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
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={newItem.imageUrl}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    imageUrl: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;