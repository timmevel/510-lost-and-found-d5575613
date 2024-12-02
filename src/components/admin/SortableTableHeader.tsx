import { TableHead } from "../ui/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

interface SortableTableHeaderProps {
  column: string;
  label: string;
  currentSort: { column: string; direction: 'asc' | 'desc' } | null;
  onSort: (column: string) => void;
}

const SortableTableHeader = ({ column, label, currentSort, onSort }: SortableTableHeaderProps) => {
  return (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => onSort(column)}
        className="h-8 flex items-center gap-1 -ml-4"
      >
        {label}
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </TableHead>
  );
};

export default SortableTableHeader;