import { useState } from "react";
import { Item, ItemStatus } from "@/types/item";
import Fuse from "fuse.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import SearchBar from "./SearchBar";
import SortableTableHeader from "./SortableTableHeader";
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
import ItemCountdown from "../ItemCountdown";
import ItemImage from "./table/ItemImage";
import ItemStatusButton from "./table/ItemStatusButton";
import UserInfo from "./table/UserInfo";
import ItemActions from "./table/ItemActions";
import ItemFilters from "./table/ItemFilters";

interface ItemsTableProps {
  items: Item[];
  onStatusChange: (id: string, status: ItemStatus, retrievedBy?: { name: string; email: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  showArchived?: boolean;
}

const ItemsTable = ({ items, onStatusChange, onDelete, onArchive, showArchived = false }: ItemsTableProps) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ column: string; direction: 'asc' | 'desc' } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [itemToArchive, setItemToArchive] = useState<string | null>(null);
  const [itemToMarkAsRetrieved, setItemToMarkAsRetrieved] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<ItemStatus | "all">("all");

  const fuse = new Fuse(items, {
    keys: ["description", "reserved_by_name", "reserved_by_email", "retrieved_by_name", "retrieved_by_email"],
    threshold: 0.3,
  });

  const handleSort = (column: string) => {
    if (sort?.column === column) {
      setSort(prev => prev ? {
        column,
        direction: prev.direction === 'asc' ? 'desc' : 'asc'
      } : { column, direction: 'asc' });
    } else {
      setSort({ column, direction: 'asc' });
    }
  };

  const sortItems = (items: Item[]) => {
    if (!sort) return items;

    return [...items].sort((a: any, b: any) => {
      const aValue = a[sort.column];
      const bValue = b[sort.column];

      if (aValue === null) return 1;
      if (bValue === null) return -1;

      const comparison = aValue.localeCompare(bValue);
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  };

  const filteredItems = search
    ? fuse.search(search).map(result => result.item)
    : items.filter(item => item.status !== "Expiré");

  const filteredByStatus = currentFilter === "all" 
    ? filteredItems 
    : filteredItems.filter(item => item.status === currentFilter);

  const sortedItems = sortItems(filteredByStatus);

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

  return (
    <>
      <div className="space-y-4">
        <SearchBar value={search} onChange={setSearch} />
        <ItemFilters currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <SortableTableHeader
                column="description"
                label="Description"
                currentSort={sort}
                onSort={handleSort}
              />
              <SortableTableHeader
                column="status"
                label="Statut"
                currentSort={sort}
                onSort={handleSort}
              />
              <TableHead>Délai</TableHead>
              <SortableTableHeader
                column="reserved_by_name"
                label="Réservé par"
                currentSort={sort}
                onSort={handleSort}
              />
              <SortableTableHeader
                column="retrieved_by_name"
                label="Récupéré par"
                currentSort={sort}
                onSort={handleSort}
              />
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.map((item) => (
              <TableRow
                key={item.id}
                className={item.status === "Expiré" ? "bg-red-50" : undefined}
              >
                <TableCell>
                  <ItemImage imageUrl={item.image_url} description={item.description} />
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <ItemStatusButton
                    status={item.status}
                    onStatusChange={(newStatus) => onStatusChange(item.id, newStatus)}
                  />
                </TableCell>
                <TableCell>
                  <ItemCountdown createdAt={item.created_at} variant="admin" />
                </TableCell>
                <TableCell>
                  <UserInfo name={item.reserved_by_name} email={item.reserved_by_email} />
                </TableCell>
                <TableCell>
                  <UserInfo name={item.retrieved_by_name} email={item.retrieved_by_email} />
                </TableCell>
                <TableCell>
                  <ItemActions
                    status={item.status}
                    isArchived={item.is_archived}
                    onMarkAsRetrieved={() => setItemToMarkAsRetrieved(item.id)}
                    onArchive={() => setItemToArchive(item.id)}
                    onDelete={() => setItemToDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
    </>
  );
};

export default ItemsTable;