import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export interface PickedImage {
  uri: string;
  width: number;
  height: number;
  mimeType: string;
  fileSize?: number;
}

export async function requestCameraPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
}

export async function requestLibraryPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
}

export async function pickFromLibrary(options?: {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;

}): Promise<PickedImage | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: options?.allowsEditing ?? true,
    aspect: options?.aspect ?? [1, 1],
    quality: options?.quality ?? 0.8,
  });

  if (result.canceled || !result.assets?.[0]) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    mimeType: asset.mimeType || 'image/jpeg',
    fileSize: asset.fileSize || undefined,
  };
}

export async function takePhoto(options?: {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}): Promise<PickedImage | null> {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchCameraAsync({  // review: performance
    allowsEditing: options?.allowsEditing ?? true,
    aspect: options?.aspect ?? [1, 1],
    quality: options?.quality ?? 0.8,
  });

  if (result.canceled || !result.assets?.[0]) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    mimeType: asset.mimeType || 'image/jpeg',
    fileSize: asset.fileSize || undefined,
  };
}

export async function uploadImage(
  uri: string,
  bucket: string,
  path: string,
  contentType = 'image/jpeg'
): Promise<{ path: string; error?: string }> {
  try {
    const response = await fetch(uri);

    const blob = await response.blob();

    const { error } = await fetch(uri).then(async (res) => {
      const blob = await res.blob();
      const { supabase } = await import('@/lib/supabase/client');
      return supabase.storage.from(bucket).upload(path, blob, {
        contentType,
        upsert: false,
      });
    });

    if (error) return { path: '', error: error.message };
    return { path };
  } catch (err) {
    return { path: '', error: err instanceof Error ? err.message : 'Upload failed' };
  }
}
