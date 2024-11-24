import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Item, ItemStatus } from '@/types/item';
import { differenceInDays, subDays } from 'date-fns';

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
    const oneDayAgo = subDays(new Date(), 1).toISOString();
    
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .or(`status.neq.Expiré,and(status.eq.Expiré,created_at.gt.${oneDayAgo})`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;

    // Update expired items
    const updatedItems = data?.map(item => {
      if (item.status === "À récupérer") {
        const daysLeft = 30 - differenceInDays(new Date(), new Date(item.created_at));
        if (daysLeft <= 0) {
          // Update item status in database
          supabase
            .from('items')
            .update({ status: "Expiré" })
            .eq('id', item.id)
            .then(() => {
              console.log(`Item ${item.id} marked as expired`);
            })
            .catch(console.error);
          
          return { ...item, status: "Expiré" };
        }
      }
      return item;
    });

    set({ items: updatedItems || [] });
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

  updateItemStatus: async (id, status, retrievedBy) => {
    const updateData: any = { status };
    
    if (retrievedBy) {
      updateData.retrieved_by_name = retrievedBy.name;
      updateData.retrieved_by_email = retrievedBy.email;
    }

    const { error } = await supabase
      .from('items')
      .update(updateData)
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

  deleteItem: async (id) => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await useStore.getState().fetchItems();
  },

  archiveItem: async (id) => {
    const { error } = await supabase
      .from('items')
      .update({ is_archived: true })
      .eq('id', id);

    if (error) throw error;
    await useStore.getState().fetchItems();
  },
}));