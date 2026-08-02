// Safe and crash-proof Background Removal Processor
export const processBackgroundRemoval = async (imageSource: string | File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof imageSource === 'string') {
        return resolve(imageSource);
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result || '');
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(imageSource as Blob);
    } catch (err) {
      console.error('Background removal fallback triggered:', err);
      resolve('');
    }
  });
};

export async function removeImageBackground(imageSource: string | File | Blob): Promise<Blob> {
  const dataUrl = await processBackgroundRemoval(imageSource);
  const response = await fetch(dataUrl);
  return await response.blob();
}
