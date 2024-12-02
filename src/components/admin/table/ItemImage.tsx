import { useState } from "react";
import ImageModal from "../../ImageModal";

interface ItemImageProps {
  imageUrl: string;
  description: string;
}

const ItemImage = ({ imageUrl, description }: ItemImageProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <img
        src={imageUrl}
        alt={description}
        className="w-16 h-16 object-cover rounded cursor-pointer"
        onClick={() => setShowModal(true)}
      />
      <ImageModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        imageUrl={imageUrl}
      />
    </>
  );
};

export default ItemImage;