import { v2 as cloudinary } from 'cloudinary'

// Server-only check
if (typeof window !== 'undefined') {
  throw new Error('Cloudinary can only be used on the server')
}

// Validate and configure Cloudinary - fail fast if env vars are missing
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  const missing = []
  if (!CLOUDINARY_CLOUD_NAME) missing.push('CLOUDINARY_CLOUD_NAME')
  if (!CLOUDINARY_API_KEY) missing.push('CLOUDINARY_API_KEY')
  if (!CLOUDINARY_API_SECRET) missing.push('CLOUDINARY_API_SECRET')
  
  throw new Error(
    `Cloudinary configuration is missing required environment variables: ${missing.join(', ')}. ` +
    `Please add them to your .env.local file.`
  )
}

// Configure Cloudinary - always called once at module load
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

// Optional debug (dev only) - uncomment to verify configuration
// if (process.env.NODE_ENV === 'development') {
//   console.log('✅ Cloudinary configured successfully')
// }

export interface UploadResult {
  url: string
  publicId: string
  width?: number
  height?: number
  format?: string
  size?: number
}

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(
  file: File | Buffer,
  options?: {
    folder?: string
    tags?: string[]
    resourceType?: 'image' | 'video' | 'auto'
  }
): Promise<UploadResult> {
  // Configuration is validated at module load, so we can proceed directly
  const folder = options?.folder || 'bloom-branding'
  const tags = options?.tags || []
  const resourceType = options?.resourceType || 'auto'

  try {
    // Convert File to buffer if needed
    let buffer: Buffer
    let originalName = 'upload'

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
      originalName = file.name
    } else {
      buffer = file
    }

    // Upload to Cloudinary
    const result = await new Promise<UploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          tags: tags.length > 0 ? tags : undefined,
          resource_type: resourceType,
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`))
            return
          }
          if (!result) {
            reject(new Error('Cloudinary upload returned no result'))
            return
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes,
          })
        }
      )

      uploadStream.end(buffer)
    })

    return result
  } catch (error) {
    throw new Error(
      `Failed to upload to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  // Configuration is validated at module load, so we can proceed directly
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    throw new Error(
      `Failed to delete from Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export default cloudinary

