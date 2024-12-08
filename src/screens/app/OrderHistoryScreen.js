import React, { useState, useEffect } from "react";
import { ScrollView, Image, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { Text, YStack, XStack, Button } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "../../components/common/GlassCard";
import theme from "../../constants/theme";
import ScreenLayout from "../../components/common/ScreenLayout";
import axiosInstance from "../../services/axiosInstance";

const OrderStatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return theme.colors.secondary.yellow;
      case "shipped":
        return theme.colors.secondary.blue;
      case "delivered":
        return theme.colors.secondary.green;
      case "cancelled":
        return theme.colors.secondary.red;
      default:
        return theme.colors.text.secondary;
    }
  };

  return (
    <XStack
      backgroundColor={`${getStatusColor()}20`}
      paddingHorizontal="$2"
      paddingVertical="$1"
      borderRadius="$2"
      alignItems="center"
      space="$1"
    >
      <YStack
        width={8}
        height={8}
        borderRadius={4}
        backgroundColor={getStatusColor()}
      />
      <Text color={getStatusColor()} fontSize="$3" textTransform="capitalize">
        {status}
      </Text>
    </XStack>
  );
};

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `orders/buyer-orders?page=${page}`
      );

      if (response.data) {
        setOrders(response.data.orders);
        setCurrentPage(response.data.page);
        setTotalPages(response.data.pages);
        setTotalOrders(response.data.total);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Error", "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchOrders(1).finally(() => setRefreshing(false));
  }, []);

  if (loading) {
    return (
      <ScreenLayout>
        <YStack flex={1} justifyContent="center" alignItems="center" space="$4">
          <ActivityIndicator
            size="large"
            color={theme.colors.secondary.yellow}
          />
          <Text color={theme.colors.text.primary} fontSize="$4">
            Loading orders...
          </Text>
        </YStack>
      </ScreenLayout>
    );
  }

  if (error) {
    return (
      <ScreenLayout>
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          space="$4"
          padding="$4"
        >
          <Ionicons
            name="warning-outline"
            size={48}
            color={theme.colors.text.error}
          />
          <Text
            color={theme.colors.text.error}
            fontSize="$4"
            textAlign="center"
          >
            {error}
          </Text>
          <Button
            size="$4"
            backgroundColor={theme.colors.secondary.yellow}
            color={theme.colors.primary.dark}
            onPress={() => fetchOrders(currentPage)}
            icon={
              <Ionicons
                name="refresh"
                size={20}
                color={theme.colors.primary.dark}
              />
            }
          >
            Retry
          </Button>
        </YStack>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.secondary.yellow}
            colors={[theme.colors.secondary.yellow]}
            progressBackgroundColor={theme.colors.glass.light}
            progressViewOffset={20}
            title="Pull to refresh"
            titleColor={theme.colors.text.primary}
          />
        }
      >
        <YStack space="$4" padding="$4">
          <Text
            color={theme.colors.text.accent}
            fontSize="$8"
            fontWeight="bold"
          >
            Order History ({totalOrders} Orders)
          </Text>

          {orders.length === 0 ? (
            <GlassCard padding="$4">
              <Text
                color={theme.colors.text.secondary}
                fontSize="$4"
                textAlign="center"
              >
                No orders found
              </Text>
            </GlassCard>
          ) : (
            orders.map((order, index) => (
              <GlassCard key={order._id} padding="$4">
                <YStack space="$3">
                  {/* Order Header - Updated to show sequential numbers */}
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text
                      color={theme.colors.text.primary}
                      fontSize="$4"
                      fontWeight="bold"
                    >
                      Order #{(currentPage - 1) * 10 + index + 1}
                    </Text>
                    <OrderStatusBadge status={order.orderStatus || "pending"} />
                  </XStack>

                  {/* Products */}
                  {order.product &&
                    order.product.map((item) => (
                      <XStack key={item._id} space="$3" alignItems="center">
                        <Image
                          source={{ uri: item.prod?.imageUrl?.url }}
                          style={{ width: 50, height: 50, borderRadius: 8 }}
                        />
                        <YStack flex={1}>
                          <Text color={theme.colors.text.primary} fontSize="$4">
                            {item.prod?.name || "Product Discontinued"}
                          </Text>
                          <Text
                            color={theme.colors.text.secondary}
                            fontSize="$3"
                          >
                            Quantity: {item.quantity}
                          </Text>
                        </YStack>
                      </XStack>
                    ))}

                  {/* Order Footer */}
                  <XStack
                    justifyContent="space-between"
                    alignItems="center"
                    paddingTop="$2"
                    borderTopWidth={1}
                    borderColor={theme.colors.glass.border}
                  >
                    <Text color={theme.colors.text.secondary} fontSize="$3">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </Text>
                    <Text
                      color={theme.colors.text.accent}
                      fontSize="$4"
                      fontWeight="bold"
                    >
                      PKR {order.totalAmount}
                    </Text>
                  </XStack>
                </YStack>
              </GlassCard>
            ))
          )}

          {/* Updated Pagination */}
          {totalPages > 1 && (
            <GlassCard padding="$4">
              <XStack justifyContent="space-between" alignItems="center">
                <Button
                  size="$4"
                  backgroundColor={theme.colors.glass.light}
                  disabled={currentPage === 1}
                  onPress={() => setCurrentPage((prev) => prev - 1)}
                  opacity={currentPage === 1 ? 0.5 : 1}
                  icon={
                    <Ionicons
                      name="chevron-back"
                      size={20}
                      color={theme.colors.text.primary}
                    />
                  }
                >
                  Previous
                </Button>

                <Text color={theme.colors.text.primary} fontSize="$4">
                  Page {currentPage} of {totalPages}
                </Text>

                <Button
                  size="$4"
                  backgroundColor={theme.colors.glass.light}
                  disabled={currentPage === totalPages}
                  onPress={() => setCurrentPage((prev) => prev + 1)}
                  opacity={currentPage === totalPages ? 0.5 : 1}
                  icon={
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme.colors.text.primary}
                    />
                  }
                >
                  Next
                </Button>
              </XStack>
            </GlassCard>
          )}
        </YStack>
      </ScrollView>
    </ScreenLayout>
  );
}
