import { removeBackground as imglyRemoveBackground } from '@imgly/background-removal';

export async function removeImageBackground(imageSource: string | File | Blob): Promise<Blob> {
  try {
    const blob = await imglyRemoveBackground(imageSource, {
      progress: (key, current, total) => {
        console.log(`Downloading background removal assets [${key}]: ${current}/${total}`);
      },
    });
    return blob;
  } catch (error: any) {
    console.error('Failed to remove image background:', error);
    throw new Error(error?.message || 'Background removal processing failed.');
  }
}

// Alias export to satisfy apiService.ts import
export const processBackgroundRemoval = async (imageSource: string | File | Blob): Promise<string> => {
  const blob = await removeImageBackground(imageSource);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
