import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Collection {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  href: string;
  size: string;
  display_order: number;
  created_at: string;
}

interface CollectionFormData {
  name: string;
  description: string;
  image_url: string;
  href: string;
  size: string;
  display_order: string;
}

const emptyForm: CollectionFormData = {
  name: "",
  description: "",
  image_url: "",
  href: "",
  size: "small",
  display_order: "0",
};

export default function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState<CollectionFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchCollections = async () => {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Error fetching collections",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setCollections(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const openCreateDialog = () => {
    setEditingCollection(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description || "",
      image_url: collection.image_url || "",
      href: collection.href,
      size: collection.size,
      display_order: collection.display_order.toString(),
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `collections/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: urlData.publicUrl });

      toast({
        title: "Image uploaded",
        description: "Image uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const collectionData = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      image_url: formData.image_url.trim() || null,
      href: formData.href.trim(),
      size: formData.size,
      display_order: parseInt(formData.display_order) || 0,
    };

    try {
      if (editingCollection) {
        const { error } = await supabase
          .from("collections")
          .update(collectionData)
          .eq("id", editingCollection.id);

        if (error) throw error;

        toast({
          title: "Collection updated",
          description: "The collection has been updated successfully.",
        });
      } else {
        const { error } = await supabase.from("collections").insert(collectionData);

        if (error) throw error;

        toast({
          title: "Collection created",
          description: "The collection has been created successfully.",
        });
      }

      setDialogOpen(false);
      fetchCollections();
    } catch (error: any) {
      toast({
        title: "Error saving collection",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("collections").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting collection",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Collection deleted",
        description: "The collection has been deleted successfully.",
      });
      fetchCollections();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-foreground">Collections</h1>
            <p className="text-muted-foreground mt-1">
              Manage featured collections displayed on the homepage
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="rounded-none gap-2">
                <Plus className="h-4 w-4" />
                Add Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg !rounded-none max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-light text-xl">
                  {editingCollection ? "Edit Collection" : "Add Collection"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Collection Image</Label>
                  <div className="border border-dashed border-border p-4">
                    {formData.image_url ? (
                      <div className="space-y-3">
                        <div className="relative aspect-video">
                          <img
                            src={formData.image_url}
                            alt="Collection"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full rounded-none"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          {uploading ? "Uploading..." : "Change Image"}
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploading ? (
                          <div className="text-sm text-muted-foreground">
                            Uploading...
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">
                              Click to upload image
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              PNG, JPG up to 5MB
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="e.g., Flagship Phones"
                    className="rounded-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Short description for the collection"
                    className="rounded-none min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="href">Link URL *</Label>
                  <Input
                    id="href"
                    value={formData.href}
                    onChange={(e) =>
                      setFormData({ ...formData, href: e.target.value })
                    }
                    required
                    placeholder="e.g., /category/phones"
                    className="rounded-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">Size *</Label>
                    <Select
                      value={formData.size}
                      onValueChange={(value) =>
                        setFormData({ ...formData, size: value })
                      }
                    >
                      <SelectTrigger className="rounded-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (1 column)</SelectItem>
                        <SelectItem value="large">Large (2 columns)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      min="0"
                      value={formData.display_order}
                      onChange={(e) =>
                        setFormData({ ...formData, display_order: e.target.value })
                      }
                      className="rounded-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="flex-1 rounded-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex-1 rounded-none"
                  >
                    {saving ? "Saving..." : editingCollection ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border border-border">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading collections...
            </div>
          ) : collections.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No collections yet. Click "Add Collection" to create your first collection.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-light w-20">Image</TableHead>
                  <TableHead className="font-light">Name</TableHead>
                  <TableHead className="font-light">Link</TableHead>
                  <TableHead className="font-light">Size</TableHead>
                  <TableHead className="font-light">Order</TableHead>
                  <TableHead className="font-light text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>
                      {collection.image_url ? (
                        <img
                          src={collection.image_url}
                          alt={collection.name}
                          className="w-16 h-10 object-cover"
                        />
                      ) : (
                        <div className="w-16 h-10 bg-muted flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{collection.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {collection.href}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-1 bg-muted">
                        {collection.size}
                      </span>
                    </TableCell>
                    <TableCell>{collection.display_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(collection)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="!rounded-none">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Collection</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{collection.name}"? Products
                                in this collection will not be deleted but will no longer
                                be associated with any collection.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-none">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(collection.id)}
                                className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
