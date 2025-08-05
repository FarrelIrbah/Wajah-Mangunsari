-- Insert sample gardens data
INSERT INTO gardens (name, description, images, location, features, contact, address, hours, coordinates) VALUES
('Taman Keluarga Harmoni', 'Taman yang menjadi pusat kegiatan keluarga dengan berbagai tanaman hias dan sayuran organik. Dikelola secara gotong royong oleh warga RT 01.', ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'], 'RT 01', ARRAY['Tanaman Hias', 'Sayuran Organik', 'Area Bermain'], 'Bu Sari - 0812-3456-7890', 'Jl. Mangunsari Raya No. 15, RT 01/RW 01', 'Setiap hari, 06:00 - 18:00', ARRAY[-7.0513, 110.3755]),
('Kebun Bersama Lestari', 'Kebun komunal yang dikelola bersama untuk memenuhi kebutuhan sayuran warga. Menerapkan sistem pertanian organik dan pengelolaan sampah terpadu.', ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'], 'RT 02', ARRAY['Sayuran Komunal', 'Kompos', 'Biopori'], 'Pak Joko - 0813-4567-8901', 'Jl. Mangunsari Tengah No. 8, RT 02/RW 01', 'Senin-Sabtu, 05:30 - 17:00', ARRAY[-7.0518, 110.376]),
('Taman Edukasi Hijau', 'Ruang pembelajaran tentang lingkungan untuk anak-anak dan remaja. Dilengkapi dengan berbagai tanaman obat tradisional dan area belajar outdoor.', ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'], 'RT 03', ARRAY['Edukasi Lingkungan', 'Tanaman Obat', 'Area Belajar'], 'Bu Rina - 0814-5678-9012', 'Jl. Mangunsari Selatan No. 22, RT 03/RW 01', 'Selasa-Minggu, 07:00 - 16:00', ARRAY[-7.0523, 110.3765]);

-- Insert sample UMKM data
INSERT INTO umkm (name, description, images, category, products, contact, address, hours, price_range, coordinates) VALUES
('Warung Bu Sari', 'Kuliner tradisional dengan bahan-bahan segar dari kebun sendiri. Menyajikan masakan khas Jawa dengan cita rasa autentik dan harga terjangkau.', ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'], 'Kuliner', ARRAY['Gudeg', 'Sayur Lodeh', 'Tempe Bacem', 'Nasi Liwet'], 'Bu Sari - 0815-6789-0123', 'Jl. Mangunsari Raya No. 45, RT 01/RW 01', 'Setiap hari, 06:00 - 21:00', 'Rp 8.000 - Rp 25.000', ARRAY[-7.0515, 110.3758]),
('Kerajinan Bambu Pak Joko', 'Kerajinan tangan dari bambu lokal yang ramah lingkungan. Memproduksi berbagai furniture dan dekorasi dengan kualitas tinggi dan desain modern.', ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'], 'Kerajinan', ARRAY['Anyaman Bambu', 'Furniture', 'Dekorasi', 'Keranjang'], 'Pak Joko - 0816-7890-1234', 'Jl. Mangunsari Tengah No. 12, RT 02/RW 01', 'Senin-Sabtu, 08:00 - 17:00', 'Rp 15.000 - Rp 500.000', ARRAY[-7.052, 110.3762]),
('Toko Tanaman Ibu Rina', 'Penjualan bibit dan tanaman hias untuk mendukung program penghijauan. Menyediakan konsultasi gratis untuk perawatan tanaman dan desain taman.', ARRAY['/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'], 'Tanaman', ARRAY['Bibit Sayuran', 'Tanaman Hias', 'Pupuk Organik', 'Pot Tanaman'], 'Ibu Rina - 0817-8901-2345', 'Jl. Mangunsari Selatan No. 18, RT 03/RW 01', 'Setiap hari, 07:00 - 18:00', 'Rp 5.000 - Rp 150.000', ARRAY[-7.0525, 110.3767]);

-- Insert sample testimonials data
INSERT INTO testimonials (name, role, quote, image) VALUES
('Pak Sutrisno', 'Ketua RW 01', 'Mangunsari bukan hanya tempat tinggal, tapi rumah besar di mana setiap warga saling peduli dan menjaga lingkungan bersama.', '/placeholder.svg?height=100&width=100'),
('Bu Endang', 'Pengelola Taman Keluarga', 'Melalui taman ini, kami tidak hanya menanam sayuran, tapi juga menanam kebersamaan dan cinta lingkungan.', '/placeholder.svg?height=100&width=100'),
('Mas Budi', 'Pengrajin Bambu', 'UMKM kami berkembang karena dukungan warga. Kami bangga bisa berkontribusi dengan produk ramah lingkungan.', '/placeholder.svg?height=100&width=100'),
('Mbak Dewi', 'Koordinator PROKLIM', 'Program PROKLIM mengajarkan kami bahwa menjaga lingkungan adalah tanggung jawab bersama yang dimulai dari hal kecil.', '/placeholder.svg?height=100&width=100'),
('Pak Agus', 'Ketua RT 02', 'Perubahan di Mangunsari terjadi karena semangat gotong royong. Setiap warga punya peran dalam mewujudkan desa hijau.', '/placeholder.svg?height=100&width=100');

-- Insert sample gallery data
INSERT INTO gallery (title, image_url, description) VALUES
('Kegiatan Gotong Royong', '/placeholder.svg?height=600&width=400', 'Warga bergotong royong membersihkan lingkungan'),
('Penanaman Bibit', '/placeholder.svg?height=300&width=400', 'Kegiatan penanaman bibit di taman komunal'),
('Workshop PROKLIM', '/placeholder.svg?height=300&width=400', 'Workshop edukasi Program Kampung Iklim'),
('Panen Sayuran', '/placeholder.svg?height=600&width=400', 'Panen sayuran dari kebun bersama'),
('Kerajinan Bambu', '/placeholder.svg?height=300&width=400', 'Proses pembuatan kerajinan bambu'),
('Festival Desa', '/placeholder.svg?height=300&width=400', 'Festival tahunan desa Mangunsari'),
('Edukasi Lingkungan', '/placeholder.svg?height=300&width=400', 'Edukasi lingkungan untuk anak-anak');
