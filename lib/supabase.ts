import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Garden {
  id: number
  name: string
  description: string
  images: string[]
  location: string
  features: string[]
  contact: string
  address: string
  hours: string
  coordinates: [number, number]
  created_at?: string
  updated_at?: string
}

export interface UMKM {
  id: number
  name: string
  description: string
  images: string[]
  category: string
  products: string[]
  contact: string
  address: string
  hours: string
  price_range: string
  coordinates: [number, number]
  created_at?: string
  updated_at?: string
}

export interface Testimonial {
  id: number
  name: string
  role: string
  quote: string
  image: string
  created_at?: string
  updated_at?: string
}

export interface GalleryItem {
  id: number
  title: string
  image_url: string
  description?: string
  created_at?: string
  updated_at?: string
}
