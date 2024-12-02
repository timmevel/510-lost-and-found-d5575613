import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Item, ItemStatus } from '@/types/item';
import { differenceInDays, subDays } from 'date-fns';
import { Database } from '@/integrations/supabase/types';

interface StoreState {
  items: Item[];
  fetchItems: () => Promise<void>;
  addItem: (item: { description: string; image: File }) => Promise<void>;
  updateItemStatus: (id: string, status: ItemStatus, retrievedBy?: { name: string; email: string }) => Promise<void>;
  reserveItem: (id: string, name: string, email: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  archiveItem: (id: string) => Promise<void>;
}

const optimizeImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      const maxSize = 1200;
      
      if (width > height && width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      } else if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          const optimizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(optimizedFile);
        },
        'image/jpeg',
        0.8  
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

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

    const updatedItems = data?.map(item => {
      if (item.status === "À récupérer") {
        const daysLeft = 30 - differenceInDays(new Date(), new Date(item.created_at || ''));
        if (daysLeft <= 0) {
          void supabase
            .from('items')
            .update({ status: "Expiré" })
            .eq('id', item.id);
          
          return { ...item, status: "Expiré" as const };
        }
      }
      return item as Item;
    });

    set({ items: updatedItems || [] });
  },

  addItem: async ({ description, image }) => {
    const optimizedImage = await optimizeImage(image);
    
    const fileExt = 'jpg'; 
    const filePath = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('items')
      .upload(filePath, optimizedImage);
      
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('items')
      .getPublicUrl(filePath);

    const { error } = await supabase
      .from('items')
      .insert({
        description,
        image_url: publicUrl,
        status: 'À récupérer',
      });

    if (error) throw error;
    
    await useStore.getState().fetchItems();
  },

  updateItemStatus: async (id, status, retrievedBy) => {
    const updateData: Database["public"]["Tables"]["items"]["Update"] = { status };
    
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
    const { data: item } = await supabase
      .from('items')
      .select('description')
      .eq('id', id)
      .single();

    if (!item) throw new Error('Item not found');

    const { error } = await supabase
      .from('items')
      .update({
        status: 'Réservé',
        reserved_by_name: name,
        reserved_by_email: email,
      })
      .eq('id', id);

    if (error) throw error;

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
