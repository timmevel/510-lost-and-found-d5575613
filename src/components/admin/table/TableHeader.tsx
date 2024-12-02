import {
  TableHead,
  TableHeader as UITableHeader,
  TableRow,
} from "@/components/ui/table";
import SortableTableHeader from "../SortableTableHeader";

interface TableHeaderProps {
  sort: { column: string; direction: 'asc' | 'desc' } | null;
  onSort: (column: string) => void;
}

const TableHeader = ({ sort, onSort }: TableHeaderProps) => {
  return (
    <UITableHeader>
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
    </UITableHeader>
  );
};

export default TableHeader;