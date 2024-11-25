import { X } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageModal = ({ isOpen, onClose, imageUrl }: ImageModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
        <img
          src={imageUrl}
          alt="Full size"
          className="w-full h-auto object-contain max-h-[80vh]"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;