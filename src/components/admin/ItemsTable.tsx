import { useState } from "react";
import { Item, ItemStatus } from "@/types/item";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import ImageModal from "../ImageModal";

interface ItemsTableProps {
  items: Item[];
  onStatusChange: (id: string, status: ItemStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const ItemsTable = ({ items, onStatusChange, onDelete }: ItemsTableProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
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
                    className="w-16 h-16 object-cover rounded cursor-pointer"
                    onClick={() => setSelectedImage(item.image_url)}
                  />
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Select
                    value={item.status}
                    onValueChange={(value: ItemStatus) =>
                      onStatusChange(item.id, value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Changer le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="À récupérer">À récupérer</SelectItem>
                      <SelectItem value="Réservé">Réservé</SelectItem>
                      <SelectItem value="Récupéré">Récupéré</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
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
                  <div className="space-x-2">
                    {item.status !== "Récupéré" && (
                      <Button
                        variant="outline"
                        onClick={() => onStatusChange(item.id, "Récupéré")}
                      >
                        Marquer comme récupéré
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => onDelete(item.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ""}
      />
    </>
  );
};

export default ItemsTable;