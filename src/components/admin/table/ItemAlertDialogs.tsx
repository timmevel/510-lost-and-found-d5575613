import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";

interface ItemAlertDialogsProps {
  itemToDelete: string | null;
  itemToArchive: string | null;
  onDeleteCancel: () => void;
  onArchiveCancel: () => void;
  onDeleteConfirm: () => Promise<void>;
  onArchiveConfirm: () => Promise<void>;
}

const ItemAlertDialogs = ({
  itemToDelete,
  itemToArchive,
  onDeleteCancel,
  onArchiveCancel,
  onDeleteConfirm,
  onArchiveConfirm,
}: ItemAlertDialogsProps) => {
  return (
    <>
      <AlertDialog open={!!itemToDelete} onOpenChange={onDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'objet sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteConfirm}
              className="bg-red-500 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!itemToArchive} onOpenChange={onArchiveCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archiver l'objet ?</AlertDialogTitle>
            <AlertDialogDescription>
              L'objet sera archivé et n'apparaîtra plus dans la liste principale.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={onArchiveConfirm}>
              Archiver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ItemAlertDialogs;