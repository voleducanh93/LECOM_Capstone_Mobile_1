import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../hooks/useCart";
import { useCheckout } from "../hooks/useCheckout";

export function CheckoutScreen({ navigation }: any) {
  const { items, subtotal, isLoading: cartLoading } = useCart();
  const { checkout, isLoading: isPending } = useCheckout();

  // ✅ Fixed shipping fee
  const SHIPPING_FEE = 30000;

  const [formData, setFormData] = useState({
    shipToName: "",
    shipToPhone: "",
    shipToAddress: "",
    note: "",
  });

  const [checkoutResult, setCheckoutResult] = useState<any>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getTotalItems = () => {
    if (!items) return 0;
    return items.reduce((total, shop) => total + shop.items.length, 0);
  };

  // ✅ Calculate total with shipping
  const calculateTotal = () => {
    return subtotal + SHIPPING_FEE;
  };

  const validateForm = () => {
    if (!formData.shipToName.trim()) {
      Alert.alert("Error", "Please enter recipient name");
      return false;
    }
    if (!formData.shipToPhone.trim()) {
      Alert.alert("Error", "Please enter phone number");
      return false;
    }
    if (!/^[0-9]{10,11}$/.test(formData.shipToPhone.trim())) {
      Alert.alert("Error", "Invalid phone number (10-11 digits)");
      return false;
    }
    if (!formData.shipToAddress.trim()) {
      Alert.alert("Error", "Please enter shipping address");
      return false;
    }
    return true;
  };

  const handleCheckout = () => {
    if (!validateForm()) return;

    checkout(formData, {
      onSuccess: (response) => {
        setCheckoutResult(response.result);
      },
      onError: (error: any) => {
        Alert.alert(
          "Checkout Failed",
          error.response?.data?.errorMessages?.[0] || "Failed to process checkout"
        );
      },
    });
  };

  const handlePayment = async () => {
    if (!checkoutResult?.paymentUrl) return;

    try {
      const supported = await Linking.canOpenURL(checkoutResult.paymentUrl);
      if (supported) {
        await Linking.openURL(checkoutResult.paymentUrl);
      } else {
        Alert.alert("Error", "Cannot open payment URL");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open payment page");
    }
  };

  const handleBackToCart = () => {
    setCheckoutResult(null);
  };

  if (cartLoading) {
    return (
      <View className="flex-1 bg-cream dark:bg-dark-background items-center justify-center">
        <ActivityIndicator size="large" color="#ACD6B8" />
        <Text className="text-light-textSecondary dark:text-dark-textSecondary mt-4">
          Loading...
        </Text>
      </View>
    );
  }

  const totalWithShipping = calculateTotal();

  // ✅ Show Order Summary after successful checkout
  if (checkoutResult) {
    return (
      <View className="flex-1 bg-cream dark:bg-dark-background">
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-6 py-4 bg-white dark:bg-dark-card border-b border-beige/30 dark:border-dark-border/30"
          style={{ paddingTop: Platform.OS === "ios" ? 50 : 16 }}
        >
          <TouchableOpacity
            onPress={handleBackToCart}
            className="w-10 h-10 rounded-full bg-beige/50 dark:bg-dark-border/50 items-center justify-center"
          >
            <FontAwesome name="arrow-left" size={18} color="#ACD6B8" />
          </TouchableOpacity>

          <Text className="flex-1 text-xl font-bold text-light-text dark:text-dark-text text-center">
            Order Summary
          </Text>

          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Message */}
          <View className="bg-mint/10 dark:bg-gold/10 rounded-2xl p-4 mb-6 border border-mint/30 dark:border-gold/30">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-mint dark:bg-gold items-center justify-center mr-4">
                <FontAwesome name="check" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-mint dark:text-gold mb-1">
                  Order Created Successfully
                </Text>
                <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  {checkoutResult.orders.length} order(s) created
                </Text>
              </View>
            </View>
          </View>

          {/* Orders List */}
          {checkoutResult.orders.map((order: any, index: number) => (
            <View
              key={order.id}
              className="bg-white dark:bg-dark-card rounded-2xl mb-4 overflow-hidden border border-beige/30 dark:border-dark-border/30"
            >
              {/* Order Header */}
              <View className="p-4 bg-beige/30 dark:bg-dark-border/30 border-b border-beige/30 dark:border-dark-border/30">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                    {order.shopName}
                  </Text>
                  <View className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30">
                    <Text className="text-orange-600 dark:text-orange-400 text-xs font-semibold">
                      {order.status}
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                  Order Code: {order.orderCode}
                </Text>
              </View>

              {/* Order Items */}
              <View className="p-4">
                {order.details.map((item: any, itemIndex: number) => (
                  <View
                    key={itemIndex}
                    className="flex-row items-center mb-3 pb-3 border-b border-beige/30 dark:border-dark-border/30 last:border-b-0 last:mb-0 last:pb-0"
                  >
                    {item.productImage ? (
                      <Image
                        source={{ uri: item.productImage }}
                        className="w-16 h-16 rounded-xl mr-3"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-16 h-16 rounded-xl bg-beige/30 dark:bg-dark-border/30 items-center justify-center mr-3">
                        <FontAwesome name="image" size={24} color="#D1D5DB" />
                      </View>
                    )}
                    <View className="flex-1">
                      <Text
                        className="text-sm font-bold text-light-text dark:text-dark-text mb-1"
                        numberOfLines={2}
                      >
                        {item.productName}
                      </Text>
                      <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                        {formatPrice(item.unitPrice)} × {item.quantity}
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-mint dark:text-gold">
                      {formatPrice(item.lineTotal)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Order Summary */}
              <View className="p-4 bg-beige/20 dark:bg-dark-border/20 border-t border-beige/30 dark:border-dark-border/30">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                    Subtotal
                  </Text>
                  <Text className="text-sm font-semibold text-light-text dark:text-dark-text">
                    {formatPrice(order.subtotal)}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                    Shipping Fee
                  </Text>
                  <Text className="text-sm font-semibold text-light-text dark:text-dark-text">
                    {formatPrice(order.shippingFee)}
                  </Text>
                </View>
                {order.discount > 0 && (
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                      Discount
                    </Text>
                    <Text className="text-sm font-semibold text-coral">
                      -{formatPrice(order.discount)}
                    </Text>
                  </View>
                )}
                <View className="h-px bg-beige/30 dark:bg-dark-border/30 my-2" />
                <View className="flex-row justify-between">
                  <Text className="text-base font-bold text-light-text dark:text-dark-text">
                    Total
                  </Text>
                  <Text className="text-base font-bold text-mint dark:text-gold">
                    {formatPrice(order.total)}
                  </Text>
                </View>
              </View>

              {/* Shipping Info */}
              <View className="p-4 border-t border-beige/30 dark:border-dark-border/30">
                <Text className="text-sm font-bold text-light-text dark:text-dark-text mb-2">
                  Shipping Information
                </Text>
                <View className="space-y-1">
                  <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                    📦 {order.shipToName}
                  </Text>
                  <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                    📞 {order.shipToPhone}
                  </Text>
                  <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                    📍 {order.shipToAddress}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          {/* Payment Summary */}
          <View className="bg-white dark:bg-dark-card rounded-2xl p-4 border border-beige/30 dark:border-dark-border/30">
            <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-4">
              Payment Summary
            </Text>

            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                Payment Method
              </Text>
              <Text className="text-sm font-semibold text-light-text dark:text-dark-text">
                {checkoutResult.paymentMethod.toUpperCase()}
              </Text>
            </View>

            {checkoutResult.walletAmountUsed > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  Wallet Used
                </Text>
                <Text className="text-sm font-semibold text-coral">
                  -{formatPrice(checkoutResult.walletAmountUsed)}
                </Text>
              </View>
            )}

            {checkoutResult.discountApplied > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  Discount Applied
                </Text>
                <Text className="text-sm font-semibold text-coral">
                  -{formatPrice(checkoutResult.discountApplied)}
                </Text>
              </View>
            )}

            <View className="h-px bg-beige/30 dark:bg-dark-border/30 my-3" />

            <View className="flex-row justify-between mb-2">
              <Text className="text-base font-bold text-light-text dark:text-dark-text">
                Total Amount
              </Text>
              <Text className="text-xl font-bold text-mint dark:text-gold">
                {formatPrice(checkoutResult.totalAmount)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                Amount to Pay
              </Text>
              <Text className="text-base font-bold text-orange-600 dark:text-orange-400">
                {formatPrice(checkoutResult.payOSAmountRequired)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action */}
        <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-beige/30 dark:border-dark-border/30 px-6 py-4">
          <TouchableOpacity
            className="bg-mint dark:bg-gold rounded-full py-4 items-center mb-3"
            onPress={handlePayment}
          >
            <View className="flex-row items-center">
              <FontAwesome name="credit-card" size={20} color="white" />
              <Text className="text-white text-base font-bold ml-2">
                Proceed to Payment
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3 items-center"
            onPress={() => navigation.navigate("Orders")}
          >
            <Text className="text-mint dark:text-gold font-semibold">
              View My Orders
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ✅ Checkout Form
  return (
    <View className="flex-1 bg-cream dark:bg-dark-background">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-6 py-4 bg-white dark:bg-dark-card border-b border-beige/30 dark:border-dark-border/30"
        style={{ paddingTop: Platform.OS === "ios" ? 50 : 16 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-beige/50 dark:bg-dark-border/50 items-center justify-center"
        >
          <FontAwesome name="arrow-left" size={18} color="#ACD6B8" />
        </TouchableOpacity>

        <Text className="flex-1 text-xl font-bold text-light-text dark:text-dark-text text-center">
          Checkout
        </Text>

        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View className="bg-white dark:bg-dark-card rounded-2xl p-4 mb-6 border border-beige/30 dark:border-dark-border/30">
          <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-3">
            Order Summary
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-light-textSecondary dark:text-dark-textSecondary">
              Total Items
            </Text>
            <Text className="font-semibold text-light-text dark:text-dark-text">
              {getTotalItems()} items
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-light-textSecondary dark:text-dark-textSecondary">
              Shops
            </Text>
            <Text className="font-semibold text-light-text dark:text-dark-text">
              {items.length} {items.length === 1 ? "shop" : "shops"}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-light-textSecondary dark:text-dark-textSecondary">
              Subtotal
            </Text>
            <Text className="font-semibold text-light-text dark:text-dark-text">
              {formatPrice(subtotal)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-light-textSecondary dark:text-dark-textSecondary">
              Shipping Fee
            </Text>
            <Text className="font-semibold text-light-text dark:text-dark-text">
              {formatPrice(SHIPPING_FEE)}
            </Text>
          </View>
          <View className="h-px bg-beige/30 dark:bg-dark-border/30 my-2" />
          <View className="flex-row justify-between">
            <Text className="text-base font-bold text-light-text dark:text-dark-text">
              Total
            </Text>
            <Text className="text-lg font-bold text-mint dark:text-gold">
              {formatPrice(totalWithShipping)}
            </Text>
          </View>
        </View>

        {/* Shipping Information Form */}
        <View className="bg-white dark:bg-dark-card rounded-2xl p-4 border border-beige/30 dark:border-dark-border/30">
          <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-4">
            Shipping Information
          </Text>

          {/* Recipient Name */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-light-text dark:text-dark-text mb-2">
              Recipient Name *
            </Text>
            <TextInput
              value={formData.shipToName}
              onChangeText={(text) => setFormData({ ...formData, shipToName: text })}
              placeholder="Enter recipient name"
              placeholderTextColor="#9CA3AF"
              className="bg-beige/30 dark:bg-dark-border/30 rounded-xl px-4 py-3 text-light-text dark:text-dark-text"
            />
          </View>

          {/* Phone Number */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-light-text dark:text-dark-text mb-2">
              Phone Number *
            </Text>
            <TextInput
              value={formData.shipToPhone}
              onChangeText={(text) => setFormData({ ...formData, shipToPhone: text })}
              placeholder="Enter phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              className="bg-beige/30 dark:bg-dark-border/30 rounded-xl px-4 py-3 text-light-text dark:text-dark-text"
            />
          </View>

          {/* Shipping Address */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-light-text dark:text-dark-text mb-2">
              Shipping Address *
            </Text>
            <TextInput
              value={formData.shipToAddress}
              onChangeText={(text) => setFormData({ ...formData, shipToAddress: text })}
              placeholder="Enter shipping address"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="bg-beige/30 dark:bg-dark-border/30 rounded-xl px-4 py-3 text-light-text dark:text-dark-text"
            />
          </View>

          {/* Note */}
          <View>
            <Text className="text-sm font-semibold text-light-text dark:text-dark-text mb-2">
              Note (Optional)
            </Text>
            <TextInput
              value={formData.note}
              onChangeText={(text) => setFormData({ ...formData, note: text })}
              placeholder="Add delivery instructions..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="bg-beige/30 dark:bg-dark-border/30 rounded-xl px-4 py-3 text-light-text dark:text-dark-text"
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-beige/30 dark:border-dark-border/30 px-6 py-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-light-textSecondary dark:text-dark-textSecondary">
            Total Payment
          </Text>
          <Text className="text-2xl font-bold text-mint dark:text-gold">
            {formatPrice(totalWithShipping)}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-mint dark:bg-gold rounded-full py-4 items-center"
          onPress={handleCheckout}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <View className="flex-row items-center">
              <FontAwesome name="check-circle" size={20} color="white" />
              <Text className="text-white text-base font-bold ml-2">
                Place Order
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}