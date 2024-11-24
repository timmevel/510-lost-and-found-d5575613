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
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <img
          src={imageUrl}
          alt="Full size"
          className="w-full h-auto object-contain"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;