
-- Create hero_slides table for admin-managed hero carousel
CREATE TABLE public.hero_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  cta_text TEXT DEFAULT 'Shop Now',
  cta_link TEXT DEFAULT '/category/shop',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Anyone can view active hero slides
CREATE POLICY "Anyone can view active hero slides"
ON public.hero_slides
FOR SELECT
USING (true);

-- Admins can manage hero slides
CREATE POLICY "Admins can insert hero slides"
ON public.hero_slides
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update hero slides"
ON public.hero_slides
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete hero slides"
ON public.hero_slides
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_hero_slides_updated_at
BEFORE UPDATE ON public.hero_slides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default slides
INSERT INTO public.hero_slides (title, subtitle, description, image_url, cta_text, cta_link, display_order) VALUES
('iPhone 16 Pro', 'Hello, Apple Intelligence.', 'The first iPhone designed for Apple Intelligence. Personal, private, powerful.', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1920&q=80', 'Learn More', '/category/phones', 0),
('AirPods Pro 2', 'Adaptive Audio. Now playing.', 'Featuring Active Noise Cancellation, Transparency mode, and Personalized Spatial Audio.', 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=1920&q=80', 'Shop AirPods', '/category/accessories', 1),
('Premium Cases', 'Designed to protect.', 'MagSafe compatible cases crafted with precision for the perfect fit.', 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=1920&q=80', 'Shop Cases', '/category/cases', 2);
