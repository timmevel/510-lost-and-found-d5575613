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
import { Trash2, Archive } from "lucide-react";
import ImageModal from "../ImageModal";
import ItemCountdown from "../ItemCountdown";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Form, FormField, FormItem, FormControl, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const retrievedBySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
});

type RetrievedByFormData = z.infer<typeof retrievedBySchema>;

interface ItemsTableProps {
  items: Item[];
  onStatusChange: (id: string, status: ItemStatus, retrievedBy?: { name: string; email: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  showArchived?: boolean;
}

const ItemsTable = ({ items, onStatusChange, onDelete, onArchive, showArchived = false }: ItemsTableProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [itemToArchive, setItemToArchive] = useState<string | null>(null);
  const [itemToMarkAsRetrieved, setItemToMarkAsRetrieved] = useState<string | null>(null);

  const form = useForm<RetrievedByFormData>({
    resolver: zodResolver(retrievedBySchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const handleDelete = async () => {
    if (itemToDelete) {
      await onDelete(itemToDelete);
      setItemToDelete(null);
    }
  };

  const handleArchive = async () => {
    if (itemToArchive) {
      await onArchive(itemToArchive);
      setItemToArchive(null);
    }
  };

  const handleMarkAsRetrieved = async (data: RetrievedByFormData) => {
    if (itemToMarkAsRetrieved) {
      await onStatusChange(itemToMarkAsRetrieved, "Récupéré", {
        name: data.name,
        email: data.email || "",
      });
      setItemToMarkAsRetrieved(null);
      form.reset();
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Délai</TableHead>
              <TableHead>Réservé par</TableHead>
              <TableHead>Récupéré par</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow 
                key={item.id}
                className={item.status === "Expiré" ? "bg-red-50" : undefined}
              >
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
                      value === "Récupéré" 
                        ? setItemToMarkAsRetrieved(item.id)
                        : onStatusChange(item.id, value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Changer le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="À récupérer">À récupérer</SelectItem>
                      <SelectItem value="Réservé">Réservé</SelectItem>
                      <SelectItem value="Récupéré">Récupéré</SelectItem>
                      <SelectItem value="Expiré">Expiré</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <ItemCountdown createdAt={item.created_at} variant="admin" />
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
                  {item.retrieved_by_name ? (
                    <div>
                      <div>{item.retrieved_by_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.retrieved_by_email}
                      </div>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-x-2">
                    {item.status !== "Récupéré" && item.status !== "Expiré" && (
                      <Button
                        variant="outline"
                        onClick={() => setItemToMarkAsRetrieved(item.id)}
                      >
                        Marquer comme récupéré
                      </Button>
                    )}
                    {(item.status === "Récupéré" || item.status === "Expiré") && !item.is_archived && (
                      <Button
                        variant="outline"
                        onClick={() => setItemToArchive(item.id)}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Archiver
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setItemToDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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

      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'objet sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!itemToArchive} onOpenChange={() => setItemToArchive(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archiver l'objet ?</AlertDialogTitle>
            <AlertDialogDescription>
              L'objet sera archivé et n'apparaîtra plus dans la liste principale.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>
              Archiver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!itemToMarkAsRetrieved} onOpenChange={(open) => {
        if (!open) {
          setItemToMarkAsRetrieved(null);
          form.reset();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Qui a récupéré l'objet ?</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleMarkAsRetrieved)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Nom</Label>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>Email (optionnel)</Label>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">
                  Confirmer
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ItemsTable;