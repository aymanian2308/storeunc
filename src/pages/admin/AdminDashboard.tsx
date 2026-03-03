import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, DollarSign, TrendingUp, ShoppingCart, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    inStockProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    statusCounts: {} as Record<string, number>,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [productsResult, usersResult, ordersResult] = await Promise.all([
        supabase.from("products").select("id, in_stock"),
        supabase.from("profiles").select("id"),
        supabase.from("orders").select("id, status, total"),
      ]);

      const products = productsResult.data || [];
      const users = usersResult.data || [];
      const orders = ordersResult.data || [];

      const statusCounts: Record<string, number> = {};
      let totalRevenue = 0;
      orders.forEach((o) => {
        statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
        totalRevenue += Number(o.total);
      });

      setStats({
        totalProducts: products.length,
        totalUsers: users.length,
        inStockProducts: products.filter((p) => p.in_stock).length,
        totalRevenue,
        totalOrders: orders.length,
        statusCounts,
      });
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-light text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your admin dashboard
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-none border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-light text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From {stats.totalOrders} orders
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-light text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All time
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-light text-muted-foreground">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.inStockProducts} in stock
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-light text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Registered accounts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Breakdown */}
        <Card className="rounded-none border-border">
          <CardHeader>
            <CardTitle className="text-lg font-light">Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { key: "pending", label: "Pending", icon: Clock, color: "text-yellow-600" },
                { key: "processing", label: "Processing", icon: TrendingUp, color: "text-blue-600" },
                { key: "shipped", label: "Shipped", icon: Truck, color: "text-purple-600" },
                { key: "delivered", label: "Delivered", icon: CheckCircle, color: "text-green-600" },
                { key: "cancelled", label: "Cancelled", icon: XCircle, color: "text-red-600" },
              ].map(({ key, label, icon: Icon, color }) => (
                <div key={key} className="flex items-center gap-3 p-3 border border-border">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <div>
                    <div className="text-2xl font-light">{stats.statusCounts[key] || 0}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-none border-border">
            <CardHeader>
              <CardTitle className="text-lg font-light">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="/admin/products"
                className="block p-4 border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-light">Manage Products</div>
                    <div className="text-sm text-muted-foreground">
                      Add, edit, or remove products
                    </div>
                  </div>
                </div>
              </a>
              <a
                href="/admin/users"
                className="block p-4 border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-light">Manage Users</div>
                    <div className="text-sm text-muted-foreground">
                      View users and manage roles
                    </div>
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>

          <Card className="rounded-none border-border">
            <CardHeader>
              <CardTitle className="text-lg font-light">Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-foreground">1.</span>
                  Add your first product in the Products section
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground">2.</span>
                  Upload product images and set pricing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground">3.</span>
                  Manage user accounts and assign admin roles
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground">4.</span>
                  Monitor your store's performance
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
