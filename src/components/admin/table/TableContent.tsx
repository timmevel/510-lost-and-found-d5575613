import { Item, ItemStatus } from "@/types/item";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import ItemCountdown from "@/components/ItemCountdown";
import ItemImage from "./ItemImage";
import ItemStatusButton from "./ItemStatusButton";
import UserInfo from "./UserInfo";
import ItemActions from "./ItemActions";

interface TableContentProps {
  items: Item[];
  onStatusChange: (id: string, status: ItemStatus) => void;
  onMarkAsRetrieved: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const TableContent = ({
  items,
  onStatusChange,
  onMarkAsRetrieved,
  onArchive,
  onDelete,
}: TableContentProps) => {
  return (
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
              onStatusChange={() => onStatusChange(item.id, item.status === "À récupérer" ? "Réservé" : "À récupérer")}
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
  );
};

export default TableContent;