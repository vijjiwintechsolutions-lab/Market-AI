import { removeBackground as imglyRemoveBackground } from '@imgly/background-removal';

export async function removeImageBackground(imageSource: string | File | Blob): Promise<Blob> {
  try {
    const blob = await imglyRemoveBackground(imageSource, {
      progress: (key, current, total) => {
        console.log(`Downloading background removal model assets [${key}]: ${current}/${total}`);
      },
    });
    return blob;
  } catch (error: any) {
    console.error('Failed to remove image background:', error);
    throw new Error(error?.message || 'Background removal processing failed.');
  }
}
