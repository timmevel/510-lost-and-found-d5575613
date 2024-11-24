import { differenceInDays } from "date-fns";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ItemCountdownProps {
  createdAt: string;
  variant?: "default" | "admin";
}

const ItemCountdown = ({ createdAt, variant = "default" }: ItemCountdownProps) => {
  const daysLeft = 30 - differenceInDays(new Date(), new Date(createdAt));
  
  const getCountdownColor = () => {
    if (daysLeft <= 3) return "text-red-500";
    if (daysLeft <= 7) return "text-yellow-500";
    return "text-muted-foreground";
  };

  return (
    <div className="flex items-center gap-1">
      <span className={`text-sm ${getCountdownColor()}`}>
        {daysLeft === 1 ? "1 jour restant" : (daysLeft > 1 ? `${daysLeft} jours restants` : "Expiré")}
      </span>
      {variant === "default" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Chaque objet trouvé est disponible pendant 30 jours. Passé ce délai,
              l'objet sera donné à une association.
            </p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default ItemCountdown;
