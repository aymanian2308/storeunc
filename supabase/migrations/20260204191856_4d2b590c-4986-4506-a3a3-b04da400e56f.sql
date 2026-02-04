-- Create collections table
CREATE TABLE public.collections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    href TEXT NOT NULL,
    size TEXT NOT NULL DEFAULT 'small' CHECK (size IN ('small', 'large')),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- RLS policies for collections
CREATE POLICY "Anyone can view collections" 
ON public.collections 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert collections" 
ON public.collections 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update collections" 
ON public.collections 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete collections" 
ON public.collections 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add collection_id to products
ALTER TABLE public.products 
ADD COLUMN collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL;

-- Create trigger for updated_at
CREATE TRIGGER update_collections_updated_at
BEFORE UPDATE ON public.collections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();