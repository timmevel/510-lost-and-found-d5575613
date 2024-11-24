import { create } from 'zustand';
import { Item, ItemStatus } from '@/types/item';

interface StoreState {
  items: Item[];
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => void;
  updateItemStatus: (id: string, status: ItemStatus) => void;
  reserveItem: (id: string, name: string, email: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  items: [
    {
      id: '1',
      description: 'Blue Nike water bottle',
      imageUrl: '/placeholder.svg',
      status: 'Lost',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      description: 'Black gym bag with red stripes',
      imageUrl: '/placeholder.svg',
      status: 'Reserved',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      reservedBy: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    },
  ],
  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          id: Math.random().toString(36).substring(7),
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  updateItemStatus: (id, status) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, status } : item
      ),
    })),
  reserveItem: (id, name, email) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Reserved' as const,
              reservedBy: { name, email },
            }
          : item
      ),
    })),
}));