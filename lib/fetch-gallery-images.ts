import { readdir } from "fs/promises"
import { join } from "path"
import { PROJECT_PREFIX } from "@/lib/cloudinary"
import { galleryFallbackImages } from "@/content/gallery-images"

const GALLERY_FOLDERS = ["mobile-background", "desktop-background"] as const

const IMAGE_EXTENSIONS = /\.(webp|jpe?g|png|gif|avif)$/i

function publicIdToLocalPath(publicId: string): string {
  const relative = publicId.startsWith(`${PROJECT_PREFIX}/`)
    ? publicId.slice(PROJECT_PREFIX.length + 1)
    : publicId

  return `/${relative}.webp`
}

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

async function listCloudinaryFolder(folder: string): Promise<string[]> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return []
  }

  const prefix = `${PROJECT_PREFIX}/${folder}`
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")
  const images: string[] = []
  let nextCursor: string | undefined

  do {
    const params = new URLSearchParams({
      type: "upload",
      prefix,
      max_results: "500",
    })
    if (nextCursor) params.set("next_cursor", nextCursor)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?${params}`,
      {
        headers: { Authorization: `Basic ${auth}` },
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      console.error(`Cloudinary list failed for ${prefix}:`, response.status)
      break
    }

    const data = (await response.json()) as {
      resources?: { public_id: string }[]
      next_cursor?: string
    }

    for (const resource of data.resources ?? []) {
      images.push(publicIdToLocalPath(resource.public_id))
    }

    nextCursor = data.next_cursor
  } while (nextCursor)

  return images
}

async function listGalleryFolders(
  listFolder: (folder: string) => Promise<string[]>
): Promise<string[]> {
  const images: string[] = []

  for (const folder of GALLERY_FOLDERS) {
    images.push(...(await listFolder(folder)))
  }

  return sortGalleryImages(images)
}

/** Loads gallery images from Cloudinary, then local public folders as fallback. */
export async function fetchGalleryImages(): Promise<string[]> {
  const cloudinaryImages = await listGalleryFolders(listCloudinaryFolder)
  if (cloudinaryImages.length > 0) {
    return cloudinaryImages
  }

  const localImages = await listGalleryFolders(listLocalFolder)
  if (localImages.length > 0) {
    return localImages
  }

  return sortGalleryImages(galleryFallbackImages)
}
