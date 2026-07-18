export function fileToOptimizedDataUrl(file, options = {}) {
  const { maxSize = 640, quality = 0.82 } = options
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('Tidak ada file yang dipilih.'))
    if (!file.type?.startsWith('image/')) return reject(new Error('File harus berupa gambar.'))
    if (file.size > 12 * 1024 * 1024) return reject(new Error('Ukuran foto maksimal 12 MB.'))

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Foto tidak dapat dibaca.'))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('Format gambar tidak didukung.'))
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
        const width = Math.max(1, Math.round(image.width * scale))
        const height = Math.max(1, Math.round(image.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const context = canvas.getContext('2d')
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, width, height)
        context.drawImage(image, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}
