import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../hooks/useCart";
import { useRemoveFromCart } from "../hooks/useRemoveFromCart";
import { useUpdateCartItem } from "../hooks/useUpdateCartItem";

export function CartScreen({ navigation }: any) {
  const { items, subtotal, isLoading, isError, refetch } = useCart();
  const removeFromCart = useRemoveFromCart();
  const updateCartItem = useUpdateCartItem();

  // ✅ Fixed shipping fee
  const SHIPPING_FEE = 30000;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert("Remove Item", `Remove "${productName}" from cart?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          removeFromCart.mutate(productId, {
            onSuccess: () => {
              Alert.alert("Success", "Product removed from cart");
            },
            onError: (error: any) => {
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to remove product"
              );
            },
          });
        },
      },
    ]);
  };

  // ✅ Quick Update Quantity - Sử dụng quantityChange
  const handleQuickUpdate = (productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) {
      Alert.alert("Invalid Quantity", "Quantity must be at least 1");
      return;
    }

    updateCartItem.mutate(
      {
        productId,
        payload: {
          quantityChange: change,
        },
      },
      {
        onSuccess: () => {
          // Success - cart sẽ tự động refetch
        },
        onError: (error: any) => {
          Alert.alert(
            "Error",
            error.response?.data?.message || "Failed to update quantity"
          );
        },
      }
    );
  };

  const handleCheckout = () => {
    if (!items || items.length === 0) {
      Alert.alert("Empty Cart", "Please add items to cart before checkout");
      return;
    }
    // ✅ Navigate to Checkout Screen
    navigation.navigate("Checkout");
  };

  const getTotalItems = () => {
    if (!items) return 0;
    return items.reduce((total, shop) => total + shop.items.length, 0);
  };

  // ✅ Calculate total with shipping
  const calculateTotal = () => {
    return subtotal + SHIPPING_FEE;
  };

  const renderEmptyCart = () => (
    <View className="flex-1 items-center justify-center px-6">
      <View className="w-32 h-32 rounded-full bg-beige/30 dark:bg-dark-border/30 items-center justify-center mb-6">
        <FontAwesome name="shopping-cart" size={64} color="#D1D5DB" />
      </View>
      <Text className="text-2xl font-bold text-light-text dark:text-dark-text mb-3">
        Cart is Empty
      </Text>
      <Text className="text-light-textSecondary dark:text-dark-textSecondary text-center mb-8">
        Add products to your cart to see them here
      </Text>
      <TouchableOpacity
        className="px-8 py-4 rounded-full bg-mint dark:bg-gold"
        onPress={() => navigation.navigate("ProductsList")}
      >
        <Text className="text-white text-base font-bold">Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoading = () => (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#ACD6B8" />
      <Text className="text-light-textSecondary dark:text-dark-textSecondary mt-4">
        Loading cart...
      </Text>
    </View>
  );

  const renderError = () => (
    <View className="flex-1 items-center justify-center px-6">
      <FontAwesome name="exclamation-circle" size={64} color="#FF6B6B" />
      <Text className="text-xl font-bold text-light-text dark:text-dark-text mt-4 mb-2">
        Something went wrong
      </Text>
      <Text className="text-light-textSecondary dark:text-dark-textSecondary text-center mb-6">
        Unable to load your cart
      </Text>
      <TouchableOpacity
        className="px-6 py-3 rounded-full bg-mint dark:bg-gold"
        onPress={() => refetch()}
      >
        <Text className="text-white font-semibold">Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartItem = (item: any, itemIndex: number) => (
    <View
      key={item.productId}
      className="bg-white dark:bg-dark-card rounded-2xl mb-3 overflow-hidden border border-beige/30 dark:border-dark-border/30"
    >
      <View className="flex-row p-4">
        {/* Product Image */}
        <TouchableOpacity
          onPress={() => {
            if (item.productSlug) {
              navigation.navigate("ProductDetail", { slug: item.productSlug });
            }
          }}
          className="relative"
        >
          {item.productImage ? (
            <Image
              source={{ uri: item.productImage }}
              className="w-20 h-20 rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <View className="w-20 h-20 rounded-xl bg-beige/30 dark:bg-dark-border/30 items-center justify-center">
              <FontAwesome name="image" size={28} color="#D1D5DB" />
            </View>
          )}
          {/* Index Badge */}
          <View className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-mint dark:bg-gold items-center justify-center">
            <Text className="text-white text-xs font-bold">{itemIndex + 1}</Text>
          </View>
        </TouchableOpacity>

        {/* Product Info */}
        <View className="flex-1 ml-3">
          <TouchableOpacity
            onPress={() => {
              if (item.productSlug) {
                navigation.navigate("ProductDetail", { slug: item.productSlug });
              }
            }}
          >
            <Text
              className="text-sm font-bold text-light-text dark:text-dark-text mb-1"
              numberOfLines={2}
            >
              {item.productName}
            </Text>
          </TouchableOpacity>

          {/* Price */}
          <Text className="text-base font-bold text-mint dark:text-gold mb-2">
            {formatPrice(item.unitPrice)}
          </Text>

          {/* Quantity Controls & Subtotal */}
          <View className="flex-row items-center justify-between">
            {/* ✅ Quantity Controls */}
            <View className="flex-row items-center">
              <TouchableOpacity
                className={`w-7 h-7 rounded-full items-center justify-center ${
                  item.quantity === 1
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "bg-mint/20 dark:bg-gold/20"
                }`}
                onPress={() => handleQuickUpdate(item.productId, item.quantity, -1)}
                disabled={item.quantity === 1 || updateCartItem.isPending}
              >
                <FontAwesome
                  name="minus"
                  size={10}
                  color={item.quantity === 1 ? "#9CA3AF" : "#ACD6B8"}
                />
              </TouchableOpacity>

              <Text className="text-sm font-bold text-light-text dark:text-dark-text mx-3">
                {item.quantity}
              </Text>

              <TouchableOpacity
                className="w-7 h-7 rounded-full bg-mint/20 dark:bg-gold/20 items-center justify-center"
                onPress={() => handleQuickUpdate(item.productId, item.quantity, +1)}
                disabled={updateCartItem.isPending}
              >
                <FontAwesome name="plus" size={10} color="#ACD6B8" />
              </TouchableOpacity>
            </View>

            {/* Subtotal */}
            <View className="items-end">
              <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                Total
              </Text>
              <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                {formatPrice(item.lineTotal)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View className="border-t border-beige/30 dark:border-dark-border/30">
        <TouchableOpacity
          className="flex-row items-center justify-center py-2.5"
          onPress={() => handleRemoveItem(item.productId, item.productName)}
          disabled={removeFromCart.isPending}
        >
          {removeFromCart.isPending ? (
            <ActivityIndicator size="small" color="#FF6B6B" />
          ) : (
            <>
              <FontAwesome name="trash-o" size={14} color="#FF6B6B" />
              <Text className="text-coral font-semibold ml-2 text-sm">Remove</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderShopGroup = (shop: any, shopIndex: number) => {
    let itemIndex = 0;
    // Calculate starting index for this shop
    for (let i = 0; i < shopIndex; i++) {
      itemIndex += items[i].items.length;
    }

    return (
      <View key={shop.shopId} className="mb-6">
        {/* Shop Header */}
        <View className="flex-row items-center mb-3 px-1">
          {shop.shopAvatar ? (
            <Image
              source={{ uri: shop.shopAvatar }}
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-mint/10 dark:bg-gold/10 items-center justify-center mr-3">
              <FontAwesome name="shopping-cart" size={18} color="#ACD6B8" />
            </View>
          )}
          <View className="flex-1">
            <Text className="text-base font-bold text-light-text dark:text-dark-text">
              {shop.shopName}
            </Text>
            <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
              {shop.items.length} {shop.items.length === 1 ? "item" : "items"}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
              Subtotal
            </Text>
            <Text className="text-base font-bold text-mint dark:text-gold">
              {formatPrice(shop.subtotal)}
            </Text>
          </View>
        </View>

        {/* Shop Items */}
        {shop.items.map((item: any) => {
          const currentItemIndex = itemIndex++;
          return renderCartItem(item, currentItemIndex);
        })}
      </View>
    );
  };

  const totalItems = getTotalItems();
  const totalWithShipping = calculateTotal();

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

        <View className="flex-1 items-center">
          <Text className="text-xl font-bold text-light-text dark:text-dark-text">
            Shopping Cart
          </Text>
          {totalItems > 0 && (
            <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
              {totalItems} {totalItems === 1 ? "item" : "items"} • {items.length}{" "}
              {items.length === 1 ? "shop" : "shops"}
            </Text>
          )}
        </View>

        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-beige/50 dark:bg-dark-border/50 items-center justify-center"
          onPress={() => refetch()}
        >
          <FontAwesome name="refresh" size={18} color="#ACD6B8" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        renderLoading()
      ) : isError ? (
        renderError()
      ) : !items || items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
          >
            {items.map((shop, index) => renderShopGroup(shop, index))}
          </ScrollView>

          {/* Bottom Summary */}
          <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-beige/30 dark:border-dark-border/30 px-6 py-4">
            {/* Summary Details */}
            <View className="mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-light-textSecondary dark:text-dark-textSecondary">
                  Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                </Text>
                <Text className="text-light-text dark:text-dark-text font-semibold">
                  {formatPrice(subtotal)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-light-textSecondary dark:text-dark-textSecondary">
                  Shipping Fee
                </Text>
                <Text className="text-light-text dark:text-dark-text font-semibold">
                  {formatPrice(SHIPPING_FEE)}
                </Text>
              </View>
              <View className="h-px bg-beige/30 dark:bg-dark-border/30 my-2" />
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold text-light-text dark:text-dark-text">
                  Total
                </Text>
                <Text className="text-lg font-bold text-mint dark:text-gold">
                  {formatPrice(totalWithShipping)}
                </Text>
              </View>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              className="bg-mint dark:bg-gold rounded-full py-4 items-center"
              onPress={handleCheckout}
            >
              <View className="flex-row items-center">
                <FontAwesome name="credit-card" size={20} color="white" />
                <Text className="text-white text-base font-bold ml-2">
                  Proceed to Checkout
                </Text>
              </View>
            </TouchableOpacity>

            {/* Continue Shopping */}
            <TouchableOpacity
              className="mt-3 py-3 items-center"
              onPress={() => navigation.navigate("Products")}
            >
              <Text className="text-mint dark:text-gold font-semibold">
                Continue Shopping
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}