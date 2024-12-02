import { Item } from "@/types/item";
import { Button } from "./ui/button";
import ItemCountdown from "./ItemCountdown";
import { useState } from "react";
import ImageModal from "./ImageModal";

interface ItemCardProps {
  item: Item;
  onReserveClick: (id: string) => void;
}

const ItemCard = ({ item, onReserveClick }: ItemCardProps) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const daysLeft = 30 - Math.floor((new Date().getTime() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24));

  const getStatusColor = () => {
    switch (item.status) {
      case "À récupérer":
        return "bg-yellow-500";
      case "Réservé":
        return "bg-teal-500";
      case "Expiré":
        return "bg-orange-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={item.image_url}
        alt={item.description}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={() => setShowImageModal(true)}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className={`${getStatusColor()} text-white px-2 py-1 rounded-full text-sm`}>
            {item.status}
          </span>
          <ItemCountdown createdAt={item.created_at} />
        </div>
        <p className="text-lg mb-4 line-clamp-2 min-h-[3.5rem]">{item.description}</p>
        {item.status === "À récupérer" && daysLeft > 0 && (
          <Button
            onClick={() => onReserveClick(item.id)}
            className="w-full"
          >
            C'est à moi
          </Button>
        )}
      </div>

      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={item.image_url}
      />
    </div>
  );
};

export default ItemCard;