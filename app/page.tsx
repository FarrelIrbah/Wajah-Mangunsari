"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Menu,
  X,
  MapPin,
  Leaf,
  Users,
  Heart,
  Camera,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import dynamic from "next/dynamic"
import { AuthButton } from "@/components/AuthButton"
import { supabase, type Garden, type UMKM, type Testimonial, type GalleryItem } from "@/lib/supabase"
import L from 'leaflet';

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

// Carousel component
const ImageCarousel = ({ images, alt }: { images: string[]; alt: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative">
      <Image
        src={images[currentIndex] || "/placeholder.svg"}
        alt={`${alt} ${currentIndex + 1}`}
        width={600}
        height={400}
        className="w-full h-64 object-cover rounded-lg"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// PROKLIM timeline data with explanation
const prokLimTimeline = [
  {
    year: "2020",
    title: "Inisiasi Program",
    description: "Mulai menerapkan prinsip-prinsip ramah lingkungan dalam kehidupan sehari-hari",
  },
  {
    year: "2021",
    title: "Pembentukan Tim",
    description: "Membentuk tim PROKLIM dan mulai sosialisasi kepada warga",
  },
  {
    year: "2022",
    title: "Implementasi Aksi",
    description: "Memulai program pengelolaan sampah, pembuatan biopori, dan penghijauan",
  },
  {
    year: "2023",
    title: "Pengembangan",
    description: "Memperluas program dengan taman komunal dan UMKM ramah lingkungan",
  },
  {
    year: "2024",
    title: "Persiapan Verifikasi",
    description: "Mempersiapkan dokumentasi dan evaluasi untuk verifikasi PROKLIM",
  },
]

export default function WajahMangunsari() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])

  // Data states
  const [gardens, setGardens] = useState<Garden[]>([])
  const [umkm, setUmkm] = useState<UMKM[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // TAMBAHKAN BLOK KODE INI DI SINI
  const { greenIcon, yellowIcon } = useMemo(() => {
    const greenIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const yellowIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    return { greenIcon, yellowIcon };
  }, []);
  
  // Smooth scroll function
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [gardensRes, umkmRes, testimonialsRes, galleryRes] = await Promise.all([
        supabase.from("gardens").select("*").order("created_at", { ascending: false }),
        supabase.from("umkm").select("*").order("created_at", { ascending: false }),
        supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
        supabase.from("gallery").select("*").order("created_at", { ascending: false }),
      ])

      if (gardensRes.data) setGardens(gardensRes.data)
      if (umkmRes.data) setUmkm(umkmRes.data)
      if (testimonialsRes.data) setTestimonials(testimonialsRes.data)
      if (galleryRes.data) setGallery(galleryRes.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/80 backdrop-blur-md border-b border-gray-200/20" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-gray-800">Mangunsari</div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => smoothScrollTo("pesona")}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Pesona
              </button>
              <button
                onClick={() => smoothScrollTo("aset-desa")}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Aset Desa
              </button>
              <button
                onClick={() => smoothScrollTo("proklim")}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                PROKLIM
              </button>
              <button
                onClick={() => smoothScrollTo("kontak")}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Kontak
              </button>
              <Button onClick={() => smoothScrollTo("peta")} className="bg-green-500 hover:bg-green-600 text-white">
                <MapPin className="w-4 h-4 mr-2" />
                Jelajahi Peta
              </Button>
              <AuthButton />
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-4">
              <button
                onClick={() => {
                  smoothScrollTo("pesona")
                  setIsMenuOpen(false)
                }}
                className="block text-gray-600 hover:text-gray-800"
              >
                Pesona
              </button>
              <button
                onClick={() => {
                  smoothScrollTo("aset-desa")
                  setIsMenuOpen(false)
                }}
                className="block text-gray-600 hover:text-gray-800"
              >
                Aset Desa
              </button>
              <button
                onClick={() => {
                  smoothScrollTo("proklim")
                  setIsMenuOpen(false)
                }}
                className="block text-gray-600 hover:text-gray-800"
              >
                PROKLIM
              </button>
              <button
                onClick={() => {
                  smoothScrollTo("kontak")
                  setIsMenuOpen(false)
                }}
                className="block text-gray-600 hover:text-gray-800"
              >
                Kontak
              </button>
              <Button
                onClick={() => {
                  smoothScrollTo("peta")
                  setIsMenuOpen(false)
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Jelajahi Peta
              </Button>
              <div className="pt-2">
                <AuthButton />
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Section 1: Hero Landing Page */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Mangunsari Village"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">Selamat Datang di Mangunsari</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">Sebuah Kisah dari Jantung Gunungpati</p>
          <p className="text-lg md:text-xl mb-12 max-w-4xl mx-auto opacity-90">
            Menyingkap Pesona, Inovasi, dan Semangat Lestari RW 01
          </p>
          <Button
            size="lg"
            onClick={() => smoothScrollTo("pesona")}
            className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-4"
          >
            Jelajahi Cerita Kami
          </Button>
        </motion.div>
      </section>

      {/* Section 2: Pesona Unik Mangunsari */}
      <section id="pesona" className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Pesona Unik Mangunsari</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empat pilar yang membentuk karakter dan keunikan desa kami
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Users className="w-12 h-12 text-green-500" />,
              title: "Komunitas Guyub",
              description: "Semangat gotong royong yang mengakar kuat dalam setiap kegiatan bersama",
            },
            {
              icon: <Heart className="w-12 h-12 text-amber-500" />,
              title: "Warisan Kuliner",
              description: "Cita rasa autentik yang diwariskan turun temurun dengan bahan lokal",
            },
            {
              icon: <Leaf className="w-12 h-12 text-green-500" />,
              title: "Alam Asri",
              description: "Lingkungan hijau yang terjaga dengan komitmen pada kelestarian",
            },
            {
              icon: <Camera className="w-12 h-12 text-amber-500" />,
              title: "Kreativitas Lokal",
              description: "Inovasi dan kreativitas warga dalam mengembangkan potensi desa",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gray-50/50">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 3: Jantung Hijau Mangunsari */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">Jantung Hijau Mangunsari</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Semangat <span className="font-semibold text-green-600">guyub</span> dan cinta pada
                  <span className="font-semibold text-green-600"> alam asri</span> telah mengakar dalam kehidupan
                  sehari-hari warga Mangunsari. Dari kebiasaan sederhana seperti memilah sampah hingga gotong royong
                  menanam pohon, setiap tindakan mencerminkan komitmen pada kelestarian.
                </p>
                <p>
                  Inisiatif-inisiatif hijau ini kemudian menemukan wadah resminya melalui
                  <span className="font-semibold text-green-600"> Program Kampung Iklim (PROKLIM)</span>. Program ini
                  bukan sekadar formalitas, melainkan pengakuan atas semangat lestari yang telah lama hidup di tengah
                  kami.
                </p>
                <p>
                  Hari ini, Mangunsari berdiri sebagai bukti bahwa perubahan besar dimulai dari langkah-langkah kecil
                  yang dilakukan bersama-sama.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Kegiatan Lingkungan Mangunsari"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-green-500 text-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">5+</div>
                <div className="text-sm">Tahun Komitmen Hijau</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: Taman Kehidupan */}
      <section id="aset-desa" className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Taman Kehidupan: Oase Hijau Kami</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ruang-ruang hijau yang menjadi bukti nyata komitmen kami pada kelestarian lingkungan
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Memuat data taman...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gardens.map((garden, index) => (
              <motion.div
                key={garden.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="relative overflow-hidden">
                        <Image
                          src={garden.images?.[0] || "/placeholder.svg"}
                          alt={garden.name}
                          width={400}
                          height={300}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-green-500 text-white">{garden.location}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{garden.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{garden.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {garden.features?.slice(0, 2).map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {garden.features && garden.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{garden.features.length - 2} lainnya
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">{garden.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <ImageCarousel images={garden.images || []} alt={garden.name} />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-gray-600 leading-relaxed mb-4">{garden.description}</p>
                          <div>
                            <h4 className="font-semibold mb-2">Fitur Unggulan:</h4>
                            <div className="flex flex-wrap gap-2">
                              {garden.features?.map((feature, idx) => (
                                <Badge key={idx} className="bg-green-100 text-green-800">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center">
                            <Phone className="w-5 h-5 text-green-500 mr-3" />
                            <div>
                              <p className="font-semibold">Kontak</p>
                              <p className="text-gray-600 text-sm">{garden.contact}</p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <MapPin className="w-5 h-5 text-green-500 mr-3" />
                            <div>
                              <p className="font-semibold">Alamat</p>
                              <p className="text-gray-600 text-sm">{garden.address}</p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <Clock className="w-5 h-5 text-green-500 mr-3" />
                            <div>
                              <p className="font-semibold">Jam Buka</p>
                              <p className="text-gray-600 text-sm">{garden.hours}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Section 5: Cita Rasa Kreatif UMKM */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Cita Rasa Kreatif: UMKM Lokal</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Denyut nadi ekonomi yang selaras dengan nilai-nilai kelestarian lingkungan
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p>Memuat data UMKM...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {umkm.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="relative overflow-hidden">
                          <Image
                            src={item.images?.[0] || "/placeholder.svg"}
                            alt={item.name}
                            width={400}
                            height={300}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-amber-500 text-white">{item.category}</Badge>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-3">{item.name}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {item.products?.slice(0, 2).map((product, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {product}
                              </Badge>
                            ))}
                            {item.products && item.products.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.products.length - 2} produk
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{item.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <ImageCarousel images={item.images || []} alt={item.name} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-gray-600 leading-relaxed mb-4">{item.description}</p>
                            <div>
                              <h4 className="font-semibold mb-2">Produk Unggulan:</h4>
                              <div className="flex flex-wrap gap-2">
                                {item.products?.map((product, idx) => (
                                  <Badge key={idx} className="bg-amber-100 text-amber-800">
                                    {product}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center">
                              <Phone className="w-5 h-5 text-amber-500 mr-3" />
                              <div>
                                <p className="font-semibold">Kontak</p>
                                <p className="text-gray-600 text-sm">{item.contact}</p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <MapPin className="w-5 h-5 text-amber-500 mr-3" />
                              <div>
                                <p className="font-semibold">Alamat</p>
                                <p className="text-gray-600 text-sm">{item.address}</p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <Clock className="w-5 h-5 text-amber-500 mr-3" />
                              <div>
                                <p className="font-semibold">Jam Operasional</p>
                                <p className="text-gray-600 text-sm">{item.hours}</p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <DollarSign className="w-5 h-5 text-amber-500 mr-3" />
                              <div>
                                <p className="font-semibold">Kisaran Harga</p>
                                <p className="text-gray-600 text-sm">{item.price_range}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 6: Interactive Map (VERSI FINAL YANG DIPERBAIKI) */}
      <section id="peta" className="py-20 px-4 max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Jelajahi Kami: Peta Digital Mangunsari</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">Temukan lokasi taman dan UMKM kami melalui peta interaktif RW 01 Kelurahan Mangunsari</p>
                    <div className="bg-green-50 p-6 rounded-xl mb-8"><p className="text-gray-700 leading-relaxed">RW 01 Mangunsari terletak di jantung Kelurahan Mangunsari, Kecamatan Gunungpati, Kota Semarang. Wilayah kami dikelilingi oleh perbukitan hijau yang asri, dengan akses mudah ke pusat kota. Setiap titik hijau pada peta menunjukkan lokasi taman komunal, sedangkan titik kuning menandai UMKM lokal yang menjadi kebanggaan warga kami.</p></div>
                </motion.div>
                <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                    <div className="h-96 relative">
                        {typeof window !== "undefined" && (
                            <MapContainer center={[-7.054, 110.378]} zoom={16} style={{ height: "100%", width: "100%" }} className="rounded-2xl">
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />

                                {/* Garden markers dengan filter pengaman dan ikon kustom */}
                                {gardens
                                    .filter(garden => garden.coordinates && garden.coordinates.length === 2)
                                    .map((garden) => (
                                        <Marker key={`garden-${garden.id}`} position={garden.coordinates as [number, number]} icon={greenIcon}>
                                            <Popup>
                                                <div className="p-1 max-w-[200px]">
                                                    <h3 className="font-bold text-green-600 text-base mb-1">{garden.name}</h3>
                                                    <p className="text-xs text-gray-500">{garden.address}</p>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}

                                {/* UMKM markers dengan filter pengaman dan ikon kustom */}
                                {umkm
                                    .filter(item => item.coordinates && item.coordinates.length === 2)
                                    .map((item) => (
                                        <Marker key={`umkm-${item.id}`} position={item.coordinates as [number, number]} icon={yellowIcon}>
                                            <Popup>
                                                <div className="p-1 max-w-[200px]">
                                                    <h3 className="font-bold text-amber-600 text-base mb-1">{item.name}</h3>
                                                    <p className="text-xs text-gray-500 mb-1">{item.address}</p>
                                                    <p className="text-xs text-green-600 font-semibold">{item.price_range}</p>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                            </MapContainer>
                        )}
                    </div>
                    <div className="p-6 bg-white">
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="flex items-center"><div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#28a745' }}></div><span className="text-sm text-gray-600">Taman & Kebun</span></div>
                            <div className="flex items-center"><div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#ffc107' }}></div><span className="text-sm text-gray-600">UMKM Lokal</span></div>
                        </div>
                    </div>
                </div>
            </section>

      {/* Section 7: Perjalanan PROKLIM */}
      <section id="proklim" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Perjalanan PROKLIM Kami</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Dari inisiasi hingga persiapan verifikasi, setiap langkah adalah bukti komitmen kami
            </p>

            {/* PROKLIM Explanation */}
            <div className="bg-green-50 p-8 rounded-2xl mb-12 text-left max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-green-800 mb-4">Apa itu PROKLIM?</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>Program Kampung Iklim (PROKLIM)</strong> adalah program nasional yang bertujuan untuk
                  meningkatkan kapasitas adaptasi dan mitigasi perubahan iklim di tingkat lokal. Program ini
                  mengintegrasikan upaya penurunan emisi gas rumah kaca dengan peningkatan ketahanan masyarakat terhadap
                  dampak perubahan iklim.
                </p>
                <p>
                  PROKLIM mencakup berbagai kegiatan seperti pengelolaan sampah, konservasi air, penghijauan, pertanian
                  ramah lingkungan, dan penggunaan energi terbarukan. Melalui program ini, masyarakat didorong untuk
                  mengadopsi gaya hidup yang lebih berkelanjutan dan ramah lingkungan.
                </p>
                <p>
                  Di Mangunsari, PROKLIM menjadi wadah untuk mengorganisir dan memperkuat inisiatif-inisiatif hijau yang
                  telah ada, sekaligus membuka peluang untuk inovasi baru dalam menjaga kelestarian lingkungan.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-200 hidden md:block"></div>

            <div className="space-y-12">
              {prokLimTimeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } flex-col md:space-x-8`}
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            {item.year}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden md:block w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Suara Mangunsari */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Suara Mangunsari</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Testimoni dari hati warga yang menjadi bagian dari perjalanan kami
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Memuat testimoni...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={
                  index === testimonials.length - 1 && testimonials.length % 3 === 1
                    ? "md:col-span-2 lg:col-span-1 lg:col-start-2"
                    : ""
                }
              >
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                    <blockquote className="text-gray-600 italic leading-relaxed">"{testimonial.quote}"</blockquote>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Section 9: Galeri Kebersamaan */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Galeri Kebersamaan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dokumentasi visual dari setiap momen kebersamaan dan kegiatan komunitas kami
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p>Memuat galeri...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative overflow-hidden rounded-xl ${
                    index === 0 || index === 3 ? "md:row-span-2" : ""
                  } ${index === gallery.length - 1 && gallery.length % 3 === 1 ? "md:col-span-2 lg:col-span-1" : ""}`}
                >
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    width={400}
                    height={index === 0 || index === 3 ? 600 : 300}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    {item.description && <p className="text-sm opacity-90">{item.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 10: Kontak & Kunjungi Kami */}
      <section id="kontak" className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Kontak & Kunjungi Kami</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mari berinteraksi dan menjadi bagian dari perjalanan Mangunsari menuju masa depan yang lebih hijau
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Informasi Kontak</h3>

                <div className="space-y-6">
                  <div className="flex items-center">
                    <Phone className="w-6 h-6 text-green-500 mr-4" />
                    <div>
                      <p className="font-semibold">Ketua RW 01</p>
                      <p className="text-gray-600">+62 812-3456-7890</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="w-6 h-6 text-green-500 mr-4" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">mangunsari.rw01@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="w-6 h-6 text-green-500 mr-4" />
                    <div>
                      <p className="font-semibold">Alamat</p>
                      <p className="text-gray-600">RW 01 Mangunsari, Gunungpati, Semarang</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Ikuti Kami</h4>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="icon">
                      <Instagram className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Facebook className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Kirim Pesan</h3>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                      <Input placeholder="Nama lengkap Anda" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input type="email" placeholder="email@example.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subjek</label>
                    <Input placeholder="Subjek pesan" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                    <Textarea placeholder="Tulis pesan Anda di sini..." rows={5} />
                  </div>

                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">Kirim Pesan</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Mangunsari</h3>
            <p className="text-gray-400 mb-6">Menyingkap Pesona, Inovasi, dan Semangat Lestari RW 01</p>
            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-sm">
                © 2024 Wajah Mangunsari. Dibuat dengan ❤️ untuk komunitas yang lestari.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
