import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Item, ItemStatus } from '@/types/item';

interface StoreState {
  items: Item[];
  fetchItems: () => Promise<void>;
  addItem: (item: { description: string; image: File }) => Promise<void>;
  updateItemStatus: (id: string, status: ItemStatus) => Promise<void>;
  reserveItem: (id: string, name: string, email: string) => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  items: [],
  
  fetchItems: async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    set({ items: data || [] });
  },

  addItem: async ({ description, image }) => {
    // Upload image first
    const fileExt = image.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('items')
      .upload(filePath, image);
      
    if (uploadError) throw uploadError;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('items')
      .getPublicUrl(filePath);

    // Create item
    const { error } = await supabase
      .from('items')
      .insert({
        description,
        image_url: publicUrl,
        status: 'À récupérer',
      });

    if (error) throw error;
    
    // Refresh items
    await useStore.getState().fetchItems();
  },

  updateItemStatus: async (id, status) => {
    const { error } = await supabase
      .from('items')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    await useStore.getState().fetchItems();
  },

  reserveItem: async (id, name, email) => {
    // Get item description for email
    const { data: item } = await supabase
      .from('items')
      .select('description')
      .eq('id', id)
      .single();

    if (!item) throw new Error('Item not found');

    // Update item status
    const { error } = await supabase
      .from('items')
      .update({
        status: 'Réservé',
        reserved_by_name: name,
        reserved_by_email: email,
      })
      .eq('id', id);

    if (error) throw error;

    // Send email notification
    await supabase.functions.invoke('send-reservation-email', {
      body: {
        itemDescription: item.description,
        reservedByName: name,
        reservedByEmail: email,
      },
    });

    await useStore.getState().fetchItems();
  },
}));