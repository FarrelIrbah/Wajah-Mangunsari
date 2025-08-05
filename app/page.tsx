// File: app/page.tsx (Versi Server yang Baru dan Benar)

import { supabase, type Garden, type UMKM, type Testimonial, type GalleryItem } from "@/lib/supabase";
import WajahMangunsariClient from "@/components/WajahMangunsariClient";

export default async function Page() {
  // Ambil data langsung di server
  const { data: gardensData } = await supabase.from("gardens").select("*").order("created_at", { ascending: false });
  const { data: umkmData } = await supabase.from("umkm").select("*").order("created_at", { ascending: false });
  const { data: testimonialsData } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
  const { data: galleryData } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });

  return (
    <WajahMangunsariClient
      initialGardens={gardensData ?? []}
      initialUmkm={umkmData ?? []}
      initialTestimonials={testimonialsData ?? []}
      initialGallery={galleryData ?? []}
    />
  );
}