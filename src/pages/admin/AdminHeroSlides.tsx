import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, GripVertical, Image } from "lucide-react";

type HeroSlide = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_link: string | null;
  display_order: number;
  is_active: boolean;
};

const emptySlide = {
  title: "",
  subtitle: "",
  description: "",
  image_url: "",
  cta_text: "Shop Now",
  cta_link: "/category/shop",
  display_order: 0,
  is_active: true,
};

const AdminHeroSlides = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [form, setForm] = useState(emptySlide);
  const [uploading, setUploading] = useState(false);

  const { data: slides, isLoading } = useQuery({
    queryKey: ["admin-hero-slides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as HeroSlide[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (slide: typeof form & { id?: string }) => {
      if (slide.id) {
        const { error } = await supabase
          .from("hero_slides")
          .update(slide)
          .eq("id", slide.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("hero_slides").insert(slide);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hero-slides"] });
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
      setIsDialogOpen(false);
      setEditingSlide(null);
      setForm(emptySlide);
      toast({ title: editingSlide ? "Slide updated" : "Slide created" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("hero_slides").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hero-slides"] });
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
      toast({ title: "Slide deleted" });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `hero/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((prev) => ({ ...prev, image_url: urlData.publicUrl }));
    setUploading(false);
  };

  const openEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle || "",
      description: slide.description || "",
      image_url: slide.image_url || "",
      cta_text: slide.cta_text || "",
      cta_link: slide.cta_link || "",
      display_order: slide.display_order,
      is_active: slide.is_active,
    });
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingSlide(null);
    setForm({ ...emptySlide, display_order: (slides?.length || 0) });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    saveMutation.mutate(editingSlide ? { ...form, id: editingSlide.id } : form);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight">Hero Slides</h1>
            <p className="text-muted-foreground mt-1">Manage the homepage hero carousel</p>
          </div>
          <Button onClick={openCreate} className="gap-2 rounded-none">
            <Plus className="h-4 w-4" /> Add Slide
          </Button>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : (
          <div className="border rounded-none">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead className="w-24">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>CTA</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slides?.map((slide) => (
                  <TableRow key={slide.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell>
                      {slide.image_url ? (
                        <img src={slide.image_url} alt="" className="w-16 h-10 object-cover" />
                      ) : (
                        <div className="w-16 h-10 bg-muted flex items-center justify-center">
                          <Image className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{slide.title}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{slide.subtitle}</TableCell>
                    <TableCell className="text-sm">{slide.cta_text}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 ${slide.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                        {slide.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(slide)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Delete this slide?")) deleteMutation.mutate(slide.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg rounded-none">
            <DialogHeader>
              <DialogTitle>{editingSlide ? "Edit Slide" : "New Slide"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <Label>Image</Label>
                {form.image_url && (
                  <img src={form.image_url} alt="Preview" className="w-full h-40 object-cover mb-2" />
                )}
                <div className="flex gap-2">
                  <Input
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="Image URL or upload"
                  />
                  <label className="cursor-pointer">
                    <Button variant="outline" size="icon" asChild disabled={uploading}>
                      <span><Image className="h-4 w-4" /></span>
                    </Button>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CTA Text</Label>
                  <Input value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} />
                </div>
                <div>
                  <Label>CTA Link</Label>
                  <Input value={form.cta_link} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Display Order</Label>
                  <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                  <Label>Active</Label>
                </div>
              </div>
              <Button onClick={handleSave} disabled={saveMutation.isPending || !form.title} className="w-full rounded-none">
                {saveMutation.isPending ? "Saving..." : editingSlide ? "Update Slide" : "Create Slide"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminHeroSlides;
