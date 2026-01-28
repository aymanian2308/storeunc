import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Package, Settings, LogOut, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
}

const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ full_name: "" });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user?.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
    } else if (data) {
      setProfile(data);
      setFormData({ full_name: data.full_name || "" });
    }
    setLoadingProfile(false);
  };

  const fetchOrders = async () => {
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
    } else if (ordersData && ordersData.length > 0) {
      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const { data: items } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", order.id);
          return { ...order, items: items || [] };
        })
      );
      setOrders(ordersWithItems);
    }
    setLoadingOrders(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: formData.full_name.trim() || null })
      .eq("user_id", user?.id);

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      fetchProfile();
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "processing":
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-light text-foreground">My Account</h1>
            <p className="text-muted-foreground mt-1">
              Manage your profile and view your orders
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 rounded-none h-auto p-0 bg-transparent border-b border-border">
              <TabsTrigger
                value="profile"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent py-3 px-4"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent py-3 px-4"
              >
                <Package className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent py-3 px-4"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="rounded-none border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-light">
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingProfile ? (
                    <div className="text-muted-foreground">Loading...</div>
                  ) : (
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile?.email || user?.email || ""}
                          disabled
                          className="rounded-none bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                          Email cannot be changed
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) =>
                            setFormData({ ...formData, full_name: e.target.value })
                          }
                          placeholder="Enter your full name"
                          className="rounded-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={saving}
                        className="rounded-none"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <Card className="rounded-none border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-light">
                    Order History
                  </CardTitle>
                  <CardDescription>
                    View your past orders and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <div className="text-muted-foreground">Loading orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-light text-foreground mb-2">
                        No orders yet
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        When you place an order, it will appear here.
                      </p>
                      <Button asChild className="rounded-none">
                        <Link to="/category/shop">Start Shopping</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-border p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Order #{order.id.slice(0, 8).toUpperCase()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                className={`rounded-none ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </Badge>
                              <p className="text-lg font-light mt-1">
                                ${order.total.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {order.items && order.items.length > 0 && (
                            <>
                              <Separator />
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-muted-foreground">
                                      {item.product_name} × {item.quantity}
                                    </span>
                                    <span>
                                      ${(item.product_price * item.quantity).toFixed(
                                        2
                                      )}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="rounded-none border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-light">
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-light">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your orders
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-light">Saved Addresses</p>
                      <p className="text-sm text-muted-foreground">
                        Manage your shipping addresses
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-light">Payment Methods</p>
                      <p className="text-sm text-muted-foreground">
                        Manage your saved payment methods
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <Separator className="my-6" />

                  <div className="pt-4">
                    <Button
                      variant="outline"
                      onClick={handleSignOut}
                      className="rounded-none gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;