import { useState } from "react";
import { Item, ItemStatus } from "@/types/item";
import Fuse from "fuse.js";
import { Table } from "../ui/table";
import SearchBar from "./SearchBar";
import ItemFilters from "./table/ItemFilters";
import ItemsTableContent from "./table/ItemsTableContent";
import ItemAlertDialogs from "./table/ItemAlertDialogs";

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
          <ItemsTableContent
            items={sortedItems}
            sort={sort}
            onSort={handleSort}
            onStatusChange={onStatusChange}
            onMarkAsRetrieved={setItemToMarkAsRetrieved}
            onArchive={setItemToArchive}
            onDelete={setItemToDelete}
          />
        </Table>
      </div>

      <ItemAlertDialogs
        itemToDelete={itemToDelete}
        itemToArchive={itemToArchive}
        onDeleteCancel={() => setItemToDelete(null)}
        onArchiveCancel={() => setItemToArchive(null)}
        onDeleteConfirm={handleDelete}
        onArchiveConfirm={handleArchive}
      />
    </>
  );
};

export default ItemsTable;