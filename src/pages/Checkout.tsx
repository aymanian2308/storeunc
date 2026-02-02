import { useState } from "react";
import { Minus, Plus, Check, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import CheckoutHeader from "../components/header/CheckoutHeader";
import Footer from "../components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const FORMSPREE_URL = "https://formspree.io/f/xlgndygr";

const Checkout = () => {
  const { items: cartItems, updateQuantity, subtotal, clearCart } = useCart();
  
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: ""
  });
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: ""
  });
  const [hasSeparateBilling, setHasSeparateBilling] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: ""
  });
  const [shippingOption, setShippingOption] = useState("standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Cash on Delivery fee
  const codFee = 5;

  const getShippingCost = () => {
    switch (shippingOption) {
      case "express":
        return 15;
      case "overnight":
        return 35;
      default:
        return 0;
    }
  };
  
  const shipping = getShippingCost();
  const total = subtotal + shipping + codFee;

  const handleDiscountSubmit = () => {
    console.log("Discount code submitted:", discountCode);
    setShowDiscountInput(false);
  };

  const handleCustomerDetailsChange = (field: string, value: string) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleShippingAddressChange = (field: string, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleBillingDetailsChange = (field: string, value: string) => {
    setBillingDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!customerDetails.email || !customerDetails.firstName || !customerDetails.lastName) {
      toast.error("Please fill in all required customer details");
      return false;
    }
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      toast.error("Please fill in all required shipping details");
      return false;
    }
    if (hasSeparateBilling) {
      if (!billingDetails.email || !billingDetails.firstName || !billingDetails.lastName ||
          !billingDetails.address || !billingDetails.city || !billingDetails.postalCode || !billingDetails.country) {
        toast.error("Please fill in all required billing details");
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);

    // Prepare order data for Formspree
    const orderData = {
      // Customer Details
      customer_email: customerDetails.email.trim(),
      customer_name: `${customerDetails.firstName.trim()} ${customerDetails.lastName.trim()}`,
      customer_phone: customerDetails.phone.trim(),
      
      // Shipping Address
      shipping_address: shippingAddress.address.trim(),
      shipping_city: shippingAddress.city.trim(),
      shipping_postal_code: shippingAddress.postalCode.trim(),
      shipping_country: shippingAddress.country.trim(),
      
      // Billing Details (if separate)
      billing_same_as_shipping: !hasSeparateBilling,
      ...(hasSeparateBilling && {
        billing_email: billingDetails.email.trim(),
        billing_name: `${billingDetails.firstName.trim()} ${billingDetails.lastName.trim()}`,
        billing_phone: billingDetails.phone.trim(),
        billing_address: billingDetails.address.trim(),
        billing_city: billingDetails.city.trim(),
        billing_postal_code: billingDetails.postalCode.trim(),
        billing_country: billingDetails.country.trim(),
      }),
      
      // Order Details
      shipping_option: shippingOption,
      shipping_cost: shipping,
      cod_fee: codFee,
      subtotal: subtotal,
      total: total,
      payment_method: "Cash on Delivery",
      
      // Products
      products: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        category: item.category || "N/A"
      })),
      products_summary: cartItems.map(item => 
        `${item.name} x${item.quantity} - €${(item.price * item.quantity).toLocaleString()}`
      ).join(" | "),
      
      // Discount
      discount_code: discountCode || "None",
      
      // Timestamp
      order_date: new Date().toISOString(),
    };

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setOrderComplete(true);
        clearCart();
        toast.success("Order placed successfully!");
      } else {
        throw new Error("Failed to submit order");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Show empty cart message if no items
  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <CheckoutHeader />
        <main className="pt-6 pb-12">
          <div className="container mx-auto px-6 text-center py-16">
            <h1 className="text-2xl font-light text-foreground mb-4">Your bag is empty</h1>
            <p className="text-muted-foreground mb-8">Add some items to your bag to proceed to checkout.</p>
            <Button asChild className="rounded-none">
              <Link to="/category/shop">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CheckoutHeader />
      
      <main className="pt-6 pb-12">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Order Summary */}
            <div className="lg:col-span-1 lg:order-2">
              <div className="bg-card p-8 border border-border sticky top-6">
                <h2 className="text-lg font-light text-foreground mb-6">Order Summary</h2>
                
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-muted overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-light text-foreground">{item.name}</h3>
                        {item.category && (
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        )}
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0 rounded-none border-border"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium text-foreground min-w-[2ch] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0 rounded-none border-border"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-foreground font-medium">
                        €{item.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code */}
                <div className="mt-8 pt-6 border-t border-border">
                  {!showDiscountInput ? (
                    <button 
                      onClick={() => setShowDiscountInput(true)}
                      className="text-sm text-primary hover:text-primary-hover transition-colors"
                    >
                      Have a discount code?
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 rounded-none"
                      />
                      <Button 
                        onClick={handleDiscountSubmit}
                        variant="outline"
                        className="rounded-none"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                <div className="border-t border-border mt-4 pt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">€{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">{shipping === 0 ? "Free" : `€${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">COD Fee</span>
                    <span className="text-foreground">€{codFee}</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium border-t border-border pt-3">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">€{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Forms */}
            <div className="lg:col-span-2 lg:order-1 space-y-8">

              {/* Customer Details */}
              <div className="bg-card p-8 border border-border">
                <h2 className="text-lg font-light text-foreground mb-6">Customer Details</h2>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-sm text-foreground">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerDetails.email}
                      onChange={(e) => handleCustomerDetailsChange("email", e.target.value)}
                      className="mt-2 rounded-none"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm text-foreground">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={customerDetails.firstName}
                        onChange={(e) => handleCustomerDetailsChange("firstName", e.target.value)}
                        className="mt-2 rounded-none"
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm text-foreground">Last Name *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={customerDetails.lastName}
                        onChange={(e) => handleCustomerDetailsChange("lastName", e.target.value)}
                        className="mt-2 rounded-none"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm text-foreground">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerDetails.phone}
                      onChange={(e) => handleCustomerDetailsChange("phone", e.target.value)}
                      className="mt-2 rounded-none"
                      placeholder="Enter your phone"
                    />
                  </div>

                  {/* Shipping Address */}
                  <div className="border-t border-border pt-6 mt-6">
                    <h3 className="text-base font-light text-foreground mb-4">Shipping Address</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="shippingAddress" className="text-sm text-foreground">Address *</Label>
                        <Input
                          id="shippingAddress"
                          type="text"
                          value={shippingAddress.address}
                          onChange={(e) => handleShippingAddressChange("address", e.target.value)}
                          className="mt-2 rounded-none"
                          placeholder="Street address"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="shippingCity" className="text-sm text-foreground">City *</Label>
                          <Input
                            id="shippingCity"
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) => handleShippingAddressChange("city", e.target.value)}
                            className="mt-2 rounded-none"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <Label htmlFor="shippingPostalCode" className="text-sm text-foreground">Postal Code *</Label>
                          <Input
                            id="shippingPostalCode"
                            type="text"
                            value={shippingAddress.postalCode}
                            onChange={(e) => handleShippingAddressChange("postalCode", e.target.value)}
                            className="mt-2 rounded-none"
                            placeholder="Postal code"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="shippingCountry" className="text-sm text-foreground">Country *</Label>
                        <Input
                          id="shippingCountry"
                          type="text"
                          value={shippingAddress.country}
                          onChange={(e) => handleShippingAddressChange("country", e.target.value)}
                          className="mt-2 rounded-none"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billing Address Toggle */}
                  <div className="border-t border-border pt-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="separateBilling"
                        checked={hasSeparateBilling}
                        onCheckedChange={(checked) => setHasSeparateBilling(checked === true)}
                      />
                      <Label htmlFor="separateBilling" className="text-sm text-foreground cursor-pointer">
                        Use different billing address
                      </Label>
                    </div>
                  </div>

                  {/* Billing Details */}
                  {hasSeparateBilling && (
                    <div className="space-y-6 pt-4">
                      <h3 className="text-base font-light text-foreground">Billing Details</h3>
                      
                      <div>
                        <Label htmlFor="billingEmail" className="text-sm text-foreground">Email *</Label>
                        <Input
                          id="billingEmail"
                          type="email"
                          value={billingDetails.email}
                          onChange={(e) => handleBillingDetailsChange("email", e.target.value)}
                          className="mt-2 rounded-none"
                          placeholder="Billing email"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billingFirstName" className="text-sm text-foreground">First Name *</Label>
                          <Input
                            id="billingFirstName"
                            type="text"
                            value={billingDetails.firstName}
                            onChange={(e) => handleBillingDetailsChange("firstName", e.target.value)}
                            className="mt-2 rounded-none"
                            placeholder="First name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingLastName" className="text-sm text-foreground">Last Name *</Label>
                          <Input
                            id="billingLastName"
                            type="text"
                            value={billingDetails.lastName}
                            onChange={(e) => handleBillingDetailsChange("lastName", e.target.value)}
                            className="mt-2 rounded-none"
                            placeholder="Last name"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="billingPhone" className="text-sm text-foreground">Phone</Label>
                        <Input
                          id="billingPhone"
                          type="tel"
                          value={billingDetails.phone}
                          onChange={(e) => handleBillingDetailsChange("phone", e.target.value)}
                          className="mt-2 rounded-none"
                          placeholder="Billing phone"
                        />
                      </div>

                      <div>
                        <Label htmlFor="billingAddress" className="text-sm text-foreground">Address *</Label>
                        <Input
                          id="billingAddress"
                          type="text"
                          value={billingDetails.address}
                          onChange={(e) => handleBillingDetailsChange("address", e.target.value)}
                          className="mt-2 rounded-none"
                          placeholder="Street address"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billingCity" className="text-sm text-foreground">City *</Label>
                          <Input
                            id="billingCity"
                            type="text"
                            value={billingDetails.city}
                            onChange={(e) => handleBillingDetailsChange("city", e.target.value)}
                            className="mt-2 rounded-none"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingPostalCode" className="text-sm text-foreground">Postal Code *</Label>
                          <Input
                            id="billingPostalCode"
                            type="text"
                            value={billingDetails.postalCode}
                            onChange={(e) => handleBillingDetailsChange("postalCode", e.target.value)}
                            className="mt-2 rounded-none"
                            placeholder="Postal code"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="billingCountry" className="text-sm text-foreground">Country *</Label>
                        <Input
                          id="billingCountry"
                          type="text"
                          value={billingDetails.country}
                          onChange={(e) => handleBillingDetailsChange("country", e.target.value)}
                          className="mt-2 rounded-none"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Options */}
              <div className="bg-card p-8 border border-border">
                <h2 className="text-lg font-light text-foreground mb-6">Shipping Options</h2>
                
                <RadioGroup 
                  value={shippingOption} 
                  onValueChange={setShippingOption}
                  className="space-y-4"
                >
                  <div className={`flex items-center justify-between p-4 border rounded-none cursor-pointer transition-colors ${
                    shippingOption === "standard" ? "border-primary bg-primary/5" : "border-border"
                  }`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="text-foreground cursor-pointer">Standard Shipping</Label>
                    </div>
                    <div className="text-sm text-muted-foreground">Free • 3-5 days</div>
                  </div>

                  <div className={`flex items-center justify-between p-4 border rounded-none cursor-pointer transition-colors ${
                    shippingOption === "express" ? "border-primary bg-primary/5" : "border-border"
                  }`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="text-foreground cursor-pointer">Express Shipping</Label>
                    </div>
                    <div className="text-sm text-muted-foreground">€15 • 1-2 days</div>
                  </div>

                  <div className={`flex items-center justify-between p-4 border rounded-none cursor-pointer transition-colors ${
                    shippingOption === "overnight" ? "border-primary bg-primary/5" : "border-border"
                  }`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="overnight" id="overnight" />
                      <Label htmlFor="overnight" className="text-foreground cursor-pointer">Overnight Delivery</Label>
                    </div>
                    <div className="text-sm text-muted-foreground">€35 • Next day</div>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment - Cash on Delivery Only */}
              <div className="bg-card p-8 border border-border">
                <h2 className="text-lg font-light text-foreground mb-6">Payment Method</h2>
                
                {!orderComplete ? (
                  <div className="space-y-6">
                    {/* COD Info */}
                    <div className="flex items-center gap-4 p-4 border border-primary bg-primary/5">
                      <Truck className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay in cash when your order arrives (+€5 fee)</p>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-none">
                      <p className="text-sm text-muted-foreground">
                        Please have the exact amount of <span className="text-primary font-medium">€{total.toLocaleString()}</span> ready when the delivery driver arrives.
                      </p>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full rounded-none h-12 text-base bg-primary hover:bg-primary-hover text-primary-foreground"
                    >
                      {isProcessing ? "Processing Order..." : `Place Order • €${total.toLocaleString()}`}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                      <Check className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-light text-foreground mb-2">Order Placed Successfully!</h3>
                    <p className="text-muted-foreground mb-6">
                      Please have €{total.toLocaleString()} ready when your order arrives.
                    </p>
                    <Button asChild variant="outline" className="rounded-none">
                      <Link to="/">Continue Shopping</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;