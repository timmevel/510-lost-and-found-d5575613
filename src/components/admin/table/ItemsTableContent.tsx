import { Item, ItemStatus } from "@/types/item";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import ItemCountdown from "../../ItemCountdown";
import ItemImage from "./ItemImage";
import ItemStatusButton from "./ItemStatusButton";
import UserInfo from "./UserInfo";
import ItemActions from "./ItemActions";
import SortableTableHeader from "../SortableTableHeader";

interface ItemsTableContentProps {
  items: Item[];
  sort: { column: string; direction: 'asc' | 'desc' } | null;
  onSort: (column: string) => void;
  onStatusChange: (id: string, status: ItemStatus) => Promise<void>;
  onMarkAsRetrieved: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const ItemsTableContent = ({
  items,
  sort,
  onSort,
  onStatusChange,
  onMarkAsRetrieved,
  onArchive,
  onDelete,
}: ItemsTableContentProps) => {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <SortableTableHeader
            column="description"
            label="Description"
            currentSort={sort}
            onSort={onSort}
          />
          <SortableTableHeader
            column="status"
            label="Statut"
            currentSort={sort}
            onSort={onSort}
          />
          <TableHead>Délai</TableHead>
          <SortableTableHeader
            column="reserved_by_name"
            label="Réservé par"
            currentSort={sort}
            onSort={onSort}
          />
          <SortableTableHeader
            column="retrieved_by_name"
            label="Récupéré par"
            currentSort={sort}
            onSort={onSort}
          />
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
                onMarkAsRetrieved={() => onMarkAsRetrieved(item.id)}
                onArchive={() => onArchive(item.id)}
                onDelete={() => onDelete(item.id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default ItemsTableContent;