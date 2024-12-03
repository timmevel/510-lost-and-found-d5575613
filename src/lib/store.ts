import { create } from 'zustand';
import { Item, ItemStatus } from '@/types/item';
import { differenceInDays } from 'date-fns';
import * as itemsApi from './api/itemsApi';

interface StoreState {
  items: Item[];
  fetchItems: () => Promise<void>;
  addItem: (item: { description: string; image: File }) => Promise<void>;
  updateItemStatus: (id: string, status: ItemStatus, retrievedBy?: { name: string; email: string }) => Promise<void>;
  reserveItem: (id: string, name: string, email: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  archiveItem: (id: string) => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  items: [],
  
  fetchItems: async () => {
    const data = await itemsApi.fetchItems();
    
    const updatedItems = data?.map(item => {
      if (item.status === "À récupérer") {
        const daysLeft = 30 - differenceInDays(new Date(), new Date(item.created_at || ''));
        if (daysLeft <= 0) {
          void itemsApi.updateItemStatus(item.id, "Expiré");
          return { ...item, status: "Expiré" as const };
        }
      }
      // Add thumbnail URL by replacing the last part of the path with 'thumbnails/'
      const thumbnailUrl = item.image_url.replace('/items/', '/items/thumbnails/');
      return { ...item, thumbnail_url: thumbnailUrl } as Item;
    });

    set({ items: updatedItems || [] });
  },

  addItem: async ({ description, image }) => {
    await itemsApi.addItem(description, image);
    await useStore.getState().fetchItems();
  },

  updateItemStatus: async (id, status, retrievedBy) => {
    await itemsApi.updateItemStatus(id, status, retrievedBy);
    await useStore.getState().fetchItems();
  },

  reserveItem: async (id, name, email) => {
    await itemsApi.reserveItem(id, name, email);
    await useStore.getState().fetchItems();
  },

  deleteItem: async (id) => {
    await itemsApi.deleteItem(id);
    await useStore.getState().fetchItems();
  },

  archiveItem: async (id) => {
    await itemsApi.archiveItem(id);
    await useStore.getState().fetchItems();
  },
}));