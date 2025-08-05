"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase, type Garden, type UMKM, type Testimonial, type GalleryItem } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MapPin, Users, Camera, Heart, LogOut } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import Swal from "sweetalert2"

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [gardens, setGardens] = useState<Garden[]>([])
  const [umkm, setUmkm] = useState<UMKM[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const router = useRouter()

  // Form states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("gardens")

  useEffect(() => {
    checkUser()
    fetchData()
  }, [])

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      router.push("/")
      return
    }
    setUser(session.user)
    setLoading(false)
  }

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
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleDelete = async (table: string, id: number, name: string) => {
    Swal.fire({
      title: `Yakin ingin menghapus "${name}"?`,
      text: "Data yang sudah dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      // Untuk theming dark mode (opsional)
      customClass: {
        popup: 'bg-white dark:bg-gray-800 rounded-lg',
        title: 'text-gray-900 dark:text-white',
        htmlContainer: 'text-gray-600 dark:text-gray-300',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { error } = await supabase.from(table).delete().eq("id", id)
          if (error) throw error
          
          Swal.fire(
            'Dihapus!',
            'Data telah berhasil dihapus.',
            'success'
          );
          fetchData(); // Panggil ulang fetchData untuk refresh data
        } catch (error: any) {
          Swal.fire(
            'Gagal!',
            `Terjadi kesalahan: ${error.message}`,
            'error'
          );
        }
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-sm text-gray-600">Kelola konten website Mangunsari</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push("/")} className="flex items-center space-x-2">
                <span>Lihat Website</span>
              </Button>
              <Button variant="outline" onClick={handleSignOut} size="icon">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Taman & Kebun</p>
                  <p className="text-2xl font-bold text-gray-900">{gardens.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-amber-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">UMKM</p>
                  <p className="text-2xl font-bold text-gray-900">{umkm.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Testimoni</p>
                  <p className="text-2xl font-bold text-gray-900">{testimonials.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Camera className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Galeri</p>
                  <p className="text-2xl font-bold text-gray-900">{gallery.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Kelola Konten</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="gardens">Taman & Kebun</TabsTrigger>
                <TabsTrigger value="umkm">UMKM</TabsTrigger>
                <TabsTrigger value="testimonials">Testimoni</TabsTrigger>
                <TabsTrigger value="gallery">Galeri</TabsTrigger>
              </TabsList>

              {/* Gardens Tab */}
              <TabsContent value="gardens" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Taman & Kebun</h3>
                  <GardenDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    editingItem={editingItem}
                    onSuccess={() => {
                      fetchData()
                      setIsDialogOpen(false)
                      setEditingItem(null)
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gardens.map((garden) => (
                    <Card key={garden.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{garden.name}</h4>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingItem(garden)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete("gardens", garden.id, garden.name)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{garden.description.slice(0, 100)}...</p>
                        <Badge variant="outline">{garden.location}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* UMKM Tab */}
              <TabsContent value="umkm" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">UMKM</h3>
                  <UMKMDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    editingItem={editingItem}
                    onSuccess={() => {
                      fetchData()
                      setIsDialogOpen(false)
                      setEditingItem(null)
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {umkm.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{item.name}</h4>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingItem(item)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete("umkm", item.id, item.name)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description.slice(0, 100)}...</p>
                        <Badge variant="outline">{item.category}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Testimonials Tab */}
              <TabsContent value="testimonials" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Testimoni</h3>
                  <TestimonialDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    editingItem={editingItem}
                    onSuccess={() => {
                      fetchData()
                      setIsDialogOpen(false)
                      setEditingItem(null)
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{testimonial.name}</h4>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingItem(testimonial)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete("testimonials", testimonial.id, testimonial.name)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">"{testimonial.quote.slice(0, 100)}..."</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Gallery Tab */}
              <TabsContent value="gallery" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Galeri</h3>
                  <GalleryDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    editingItem={editingItem}
                    onSuccess={() => {
                      fetchData()
                      setIsDialogOpen(false)
                      setEditingItem(null)
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {gallery.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">{item.title}</h4>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingItem(item)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete("gallery", item.id, item.title)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{item.description?.slice(0, 50)}...</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Garden Dialog Component
function GardenDialog({ isOpen, onOpenChange, editingItem, onSuccess }: any) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    contact: "",
    address: "",
    hours: "",
    features: "",
    images: "",
    coordinates: "",
  })

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        description: editingItem.description || "",
        location: editingItem.location || "",
        contact: editingItem.contact || "",
        address: editingItem.address || "",
        hours: editingItem.hours || "",
        features: editingItem.features?.join(", ") || "",
        images: editingItem.images?.join(", ") || "",
        coordinates: editingItem.coordinates?.join(", ") || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        location: "",
        contact: "",
        address: "",
        hours: "",
        features: "",
        images: "",
        coordinates: "",
      })
    }
  }, [editingItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      name: formData.name,
      description: formData.description,
      location: formData.location,
      contact: formData.contact,
      address: formData.address,
      hours: formData.hours,
      features: formData.features.split(",").map((s) => s.trim()),
      images: formData.images.split(",").map((s) => s.trim()),
      coordinates: formData.coordinates.split(",").map((s) => Number.parseFloat(s.trim())),
    }

    try {
      if (editingItem) {
        const { error } = await supabase.from("gardens").update(data).eq("id", editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("gardens").insert([data])
        if (error) throw error
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving garden:", error)
      alert("Gagal menyimpan data")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => onOpenChange(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Taman
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingItem ? "Edit Taman" : "Tambah Taman Baru"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nama Taman</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact">Kontak</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="hours">Jam Buka</Label>
              <Input
                id="hours"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Alamat</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="features">Fitur (pisahkan dengan koma)</Label>
            <Input
              id="features"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Tanaman Hias, Sayuran Organik, Area Bermain"
            />
          </div>
          <div>
            <Label htmlFor="images">URL Gambar (pisahkan dengan koma)</Label>
            <Input
              id="images"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="/placeholder.svg, /image2.jpg"
            />
          </div>
          <div>
            <Label htmlFor="coordinates">Koordinat (lat, lng)</Label>
            <Input
              id="coordinates"
              value={formData.coordinates}
              onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
              placeholder="-7.0513, 110.3755"
            />
          </div>
          <Button type="submit" className="w-full">
            {editingItem ? "Update" : "Tambah"} Taman
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// UMKM Dialog Component
function UMKMDialog({ isOpen, onOpenChange, editingItem, onSuccess }: any) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    contact: "",
    address: "",
    hours: "",
    price_range: "",
    products: "",
    images: "",
    coordinates: "",
  })

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        description: editingItem.description || "",
        category: editingItem.category || "",
        contact: editingItem.contact || "",
        address: editingItem.address || "",
        hours: editingItem.hours || "",
        price_range: editingItem.price_range || "",
        products: editingItem.products?.join(", ") || "",
        images: editingItem.images?.join(", ") || "",
        coordinates: editingItem.coordinates?.join(", ") || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        contact: "",
        address: "",
        hours: "",
        price_range: "",
        products: "",
        images: "",
        coordinates: "",
      })
    }
  }, [editingItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      contact: formData.contact,
      address: formData.address,
      hours: formData.hours,
      price_range: formData.price_range,
      products: formData.products.split(",").map((s) => s.trim()),
      images: formData.images.split(",").map((s) => s.trim()),
      coordinates: formData.coordinates.split(",").map((s) => Number.parseFloat(s.trim())),
    }

    try {
      if (editingItem) {
        const { error } = await supabase.from("umkm").update(data).eq("id", editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("umkm").insert([data])
        if (error) throw error
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving UMKM:", error)
      alert("Gagal menyimpan data")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => onOpenChange(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah UMKM
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingItem ? "Edit UMKM" : "Tambah UMKM Baru"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nama UMKM</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Kategori</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact">Kontak</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="hours">Jam Operasional</Label>
              <Input
                id="hours"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="price_range">Kisaran Harga</Label>
              <Input
                id="price_range"
                value={formData.price_range}
                onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="products">Produk (pisahkan dengan koma)</Label>
            <Input
              id="products"
              value={formData.products}
              onChange={(e) => setFormData({ ...formData, products: e.target.value })}
              placeholder="Gudeg, Sayur Lodeh, Tempe Bacem"
            />
          </div>
          <div>
            <Label htmlFor="images">URL Gambar (pisahkan dengan koma)</Label>
            <Input
              id="images"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="/placeholder.svg, /image2.jpg"
            />
          </div>
          <div>
            <Label htmlFor="coordinates">Koordinat (lat, lng)</Label>
            <Input
              id="coordinates"
              value={formData.coordinates}
              onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
              placeholder="-7.0515, 110.3758"
            />
          </div>
          <Button type="submit" className="w-full">
            {editingItem ? "Update" : "Tambah"} UMKM
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Testimonial Dialog Component
function TestimonialDialog({ isOpen, onOpenChange, editingItem, onSuccess }: any) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    quote: "",
    image: "",
  })

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        role: editingItem.role || "",
        quote: editingItem.quote || "",
        image: editingItem.image || "",
      })
    } else {
      setFormData({
        name: "",
        role: "",
        quote: "",
        image: "",
      })
    }
  }, [editingItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingItem) {
        const { error } = await supabase.from("testimonials").update(formData).eq("id", editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("testimonials").insert([formData])
        if (error) throw error
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving testimonial:", error)
      alert("Gagal menyimpan data")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => onOpenChange(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Testimoni
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingItem ? "Edit Testimoni" : "Tambah Testimoni Baru"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Jabatan/Peran</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="quote">Testimoni</Label>
            <Textarea
              id="quote"
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="image">URL Foto</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="/placeholder.svg?height=100&width=100"
            />
          </div>
          <Button type="submit" className="w-full">
            {editingItem ? "Update" : "Tambah"} Testimoni
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Gallery Dialog Component
function GalleryDialog({ isOpen, onOpenChange, editingItem, onSuccess }: any) {
  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    description: "",
  })

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || "",
        image_url: editingItem.image_url || "",
        description: editingItem.description || "",
      })
    } else {
      setFormData({
        title: "",
        image_url: "",
        description: "",
      })
    }
  }, [editingItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingItem) {
        const { error } = await supabase.from("gallery").update(formData).eq("id", editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("gallery").insert([formData])
        if (error) throw error
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving gallery item:", error)
      alert("Gagal menyimpan data")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => onOpenChange(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Foto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingItem ? "Edit Foto" : "Tambah Foto Baru"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="image_url">URL Gambar</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full">
            {editingItem ? "Update" : "Tambah"} Foto
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
