import { readdir } from "fs/promises"
import { join } from "path"
import { galleryImages } from "@/content/gallery-images"

const GALLERY_FOLDERS = ["mobile-background", "desktop-background"] as const

const IMAGE_EXTENSIONS = /\.(webp|jpe?g|png|gif|avif)$/i

function sortGalleryImages(paths: string[]): string[] {
  const folderOrder = new Map(GALLERY_FOLDERS.map((folder, index) => [folder, index]))

  return [...paths].sort((a, b) => {
    const folderA = a.split("/")[1] ?? ""
    const folderB = b.split("/")[1] ?? ""
    const orderA = folderOrder.get(folderA as (typeof GALLERY_FOLDERS)[number]) ?? 99
    const orderB = folderOrder.get(folderB as (typeof GALLERY_FOLDERS)[number]) ?? 99

    if (orderA !== orderB) {
      return orderA - orderB
    }

    const numA = parseInt(a.match(/\((\d+)\)/)?.[1] || "0", 10)
    const numB = parseInt(b.match(/\((\d+)\)/)?.[1] || "0", 10)
    return numA - numB
  })
}

async function listLocalFolder(folder: string): Promise<string[]> {
  try {
    const files = await readdir(join(process.cwd(), "public", folder))
    return files
      .filter((file) => IMAGE_EXTENSIONS.test(file))
      .map((file) => `/${folder}/${file}`)
  } catch {
    return []
  }
}

/** Loads gallery images directly from public/mobile-background and public/desktop-background. */
export async function fetchGalleryImages(): Promise<string[]> {
  const images: string[] = []

  for (const folder of GALLERY_FOLDERS) {
    images.push(...(await listLocalFolder(folder)))
  }

  const localImages = sortGalleryImages(images)
  if (localImages.length > 0) {
    return localImages
  }

  return [...galleryImages]
}
