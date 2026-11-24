export async function resizeImage(file, maxSide = 1024, quality = 0.85) {
  if (!file.type.startsWith('image/')) return file
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h)
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })),
      'image/jpeg', quality,
    )
  })
}
