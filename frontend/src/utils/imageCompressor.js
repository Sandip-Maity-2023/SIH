/**
 * Helper utility to compress images on the client side before base64 encoding.
 * Reduces 10MB-20MB camera photos to ~100KB-150KB JPEG Data URLs.
 * Prevents HTTP 413 PayloadTooLarge ("request entity too large") errors permanently.
 */
export const compressImage = (file, maxDimension = 1000, quality = 0.7) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve(null);
      return;
    }

    if (!file.type || !file.type.startsWith('image/')) {
      // For non-image files (e.g. PDFs), read as standard Data URL
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        resolve(event.target.result);
      };

      img.src = event.target.result;
    };

    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};
