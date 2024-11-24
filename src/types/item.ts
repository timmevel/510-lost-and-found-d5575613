export type ItemStatus = "Lost" | "Reserved" | "Found";

export interface Item {
  id: string;
  description: string;
  imageUrl: string;
  status: ItemStatus;
  createdAt: string;
  reservedBy?: {
    name: string;
    email: string;
  };
}