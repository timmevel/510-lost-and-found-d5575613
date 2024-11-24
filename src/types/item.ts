export type ItemStatus = "À récupérer" | "Réservé" | "Récupéré" | "Expiré";

export interface Item {
  id: string;
  description: string;
  image_url: string;
  status: ItemStatus;
  created_at: string;
  reserved_by_name: string | null;
  reserved_by_email: string | null;
  retrieved_by_name: string | null;
  retrieved_by_email: string | null;
  is_archived: boolean;
}