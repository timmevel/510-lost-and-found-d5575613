export type ItemStatus = "Perdu" | "Réservé" | "Trouvé";

export interface Item {
  id: string;
  description: string;
  image_url: string;
  status: ItemStatus;
  created_at: string;
  reserved_by?: {
    name: string;
    email: string;
  };
}