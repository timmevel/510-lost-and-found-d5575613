import { supabase } from '@/integrations/supabase/client';
import { Item, ItemStatus } from '@/types/item';
import { Database } from '@/integrations/supabase/types';
import { createThumbnail, optimizeImage } from '../utils/imageProcessing';
import { subDays } from 'date-fns';

export const fetchItems = async () => {
  const oneDayAgo = subDays(new Date(), 1).toISOString();
  
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .or(`status.neq.Expiré,and(status.eq.Expiré,created_at.gt.${oneDayAgo})`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const addItem = async (description: string, image: File) => {
  const optimizedImage = await optimizeImage(image);
  const thumbnail = await createThumbnail(image);
  
  const fileExt = 'jpg';
  const fileName = crypto.randomUUID();
  const filePath = `${fileName}.${fileExt}`;
  const thumbnailPath = `thumbnails/${fileName}.${fileExt}`;
  
  // Upload original image
  const { error: uploadError } = await supabase.storage
    .from('items')
    .upload(filePath, optimizedImage);
    
  if (uploadError) throw uploadError;

  // Upload thumbnail
  const { error: thumbnailError } = await supabase.storage
    .from('items')
    .upload(thumbnailPath, thumbnail);
    
  if (thumbnailError) throw thumbnailError;

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
};

export const updateItemStatus = async (
  id: string,
  status: ItemStatus,
  retrievedBy?: { name: string; email: string }
) => {
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
};

export const reserveItem = async (id: string, name: string, email: string) => {
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
};

export const deleteItem = async (id: string) => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const archiveItem = async (id: string) => {
  const { error } = await supabase
    .from('items')
    .update({ is_archived: true })
    .eq('id', id);

  if (error) throw error;
};