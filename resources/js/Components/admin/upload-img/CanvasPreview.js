export async function canvasPreview(image, canvas, crop) {
  const ctx = canvas.getContext("2d");

  if (!ctx || !crop.width || !crop.height) {
    return;
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const sourceX = crop.x * scaleX;
  const sourceY = crop.y * scaleY;
  const sourceWidth = crop.width * scaleX;
  const sourceHeight = crop.height * scaleY;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    canvas.width / pixelRatio,
    canvas.height / pixelRatio
  );
}
