-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create gardens table
CREATE TABLE IF NOT EXISTS gardens (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  location VARCHAR(100) NOT NULL,
  features TEXT[] DEFAULT '{}',
  contact VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  hours VARCHAR(255) NOT NULL,
  coordinates DECIMAL[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create umkm table
CREATE TABLE IF NOT EXISTS umkm (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  category VARCHAR(100) NOT NULL,
  products TEXT[] DEFAULT '{}',
  contact VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  hours VARCHAR(255) NOT NULL,
  price_range VARCHAR(100) NOT NULL,
  coordinates DECIMAL[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  quote TEXT NOT NULL,
  image VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE gardens ENABLE ROW LEVEL SECURITY;
ALTER TABLE umkm ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin only)
CREATE POLICY "Enable all operations for authenticated users" ON gardens
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON umkm
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON gallery
  FOR ALL USING (auth.role() = 'authenticated');

-- Allow public read access
CREATE POLICY "Enable read access for all users" ON gardens
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON umkm
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON testimonials
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON gallery
  FOR SELECT USING (true);
