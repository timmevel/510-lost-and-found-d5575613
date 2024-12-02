import { Input } from "../ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="mb-4">
      <Input
        type="search"
        placeholder="Rechercher des objets..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-md"
      />
    </div>
  );
};

export default SearchBar;