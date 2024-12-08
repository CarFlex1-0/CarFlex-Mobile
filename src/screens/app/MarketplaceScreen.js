import React, { useState, useEffect } from "react";
import { ScrollView, RefreshControl, Image, Dimensions, Alert } from "react-native";
import { Text, YStack, XStack, Button, Input, Adapt, Sheet } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "../../components/common/GlassCard";
import theme from "../../constants/theme";
import ScreenLayout from "../../components/common/ScreenLayout";
import { ChevronDown, ChevronUp, Check } from "@tamagui/lucide-icons";
import { SelectList } from "react-native-dropdown-select-list";
import axiosInstance from "../../services/axiosInstance";
import { useCartStore } from '../../store/cartStore';

const { width } = Dimensions.get("window");

// Pakistani Brands and Categories
const PRODUCT_CATEGORIES = [
  "Engine & Drivetrain",
  "Suspension & Steering",
  "Brakes",
  "Electrical & Lighting",
  "Interior Accessories",
  "Wheels & Tires",
];

const BRANDS = ["Honda", "Toyota", "Hyndai", "Kia", "Suzuki", "Daihatsu"];

// Format data for SelectList
const CATEGORY_DATA = ["All", ...PRODUCT_CATEGORIES].map((category) => ({
  key: category,
  value: category,
}));

const BRAND_DATA = ["All", ...BRANDS].map((brand) => ({
  key: brand,
  value: brand,
}));

export default function MarketplaceScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const { addToCart } = useCartStore();

  // Fetch products with filters
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        keyword: searchQuery || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        brand: selectedBrand !== "All" ? selectedBrand : undefined,
      };

      const response = await axiosInstance.get("/products", { params });
      setProducts(response.data.products);
      setTotalPages(Math.ceil(response.data.total / response.data.pageSize));
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Effect for fetching products
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, searchQuery, selectedCategory, selectedBrand]);

  // Add to cart function
  const handleAddToCart = (product) => {
    const cartItem = {
      ...product,
      seller: {
        _id: product.seller
      }
    };
    
    addToCart(cartItem);
    Alert.alert(
      "Success",
      "Item added to cart",
      [
        {
          text: "Continue Shopping",
          style: "cancel"
        },
        {
          text: "Go to Cart",
          onPress: () => navigation.navigate("Cart")
        }
      ]
    );
  };

  // Rest of your render logic remains similar, but update the product mapping:
  return (
    <ScreenLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => {
              setRefreshing(true);
              fetchProducts(1);
            }} 
          />
        }
      >
        <YStack space="$4" padding="$4">
          {/* Header */}
          <YStack space="$2">
            <Text
              color={theme.colors.text.accent}
              fontSize="$8"
              fontWeight="bold"
              className="text-center"
            >
              Marketplace
            </Text>
            <Text
              color={theme.colors.text.primary}
              fontSize="$4"
              opacity={0.9}
              className="text-center"
            >
              Discover premium car parts
            </Text>
          </YStack>

          {/* Search and Filters */}
          <GlassCard padding="$4">
            <YStack space="$4">
              {/* Search Bar */}
              <Input
                size="$4"
                placeholder="Search products..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                backgroundColor={theme.colors.glass.light}
                color={theme.colors.text.primary}
                placeholderTextColor={theme.colors.text.secondary}
                className="rounded-xl"
                icon={
                  <Ionicons
                    name="search"
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                }
              />

              {/* Filters */}
              <YStack space="$4">
                {/* Category Filter */}
                <YStack space="$2">
                  <Text color="white" fontSize="$4" fontWeight="bold">
                    Category Filter
                  </Text>
                  <SelectList
                    setSelected={setSelectedCategory}
                    data={CATEGORY_DATA}
                    save="value"
                    placeholder="Select Category"
                    boxStyles={{
                      backgroundColor: theme.colors.glass.light,
                      borderColor: theme.colors.glass.border,
                      
                    }}
                    inputStyles={{ color: "white",  }}
                    dropdownStyles={{
                      backgroundColor: theme.colors.glass.dark,
                      borderColor: theme.colors.glass.border,
                    }}
                    dropdownTextStyles={{ color: "white" }}
                    dropdownItemStyles={{
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    }}
                    searchPlaceholder="  Search categories..."
                    
                    searchPlaceholderTextColor={"white"}
                    searchTextInputStyle={{
                      color: "white",
                      backgroundColor: theme.colors.glass.light,
                    }}
                    arrowicon={
                      <Ionicons name="chevron-down" size={20} color="white" />
                    }
                    searchicon={
                      <Ionicons name="search" size={20} color="white" />
                    }
                  />
                </YStack>

                {/* Brand Filter */}
                <YStack space="$2">
                  <Text color="white" fontSize="$4" fontWeight="bold">
                    Brand Filter
                  </Text>
                  <SelectList
                    setSelected={setSelectedBrand}
                    data={BRAND_DATA}
                    save="value"
                    placeholder="Select Brand"
                    boxStyles={{
                      backgroundColor: theme.colors.glass.light,
                      borderColor: theme.colors.glass.border,
                    }}
                    inputStyles={{ color: "white" }}
                    dropdownStyles={{
                      backgroundColor: theme.colors.glass.dark,
                      borderColor: theme.colors.glass.border,
                    }}
                    dropdownTextStyles={{ color: "white" }}
                    dropdownItemStyles={{
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    }}
                    searchPlaceholder="   Search brands..."
                    searchPlaceholderTextColor="rgba(255, 255, 255, 0.5)"
                    searchTextInputStyle={{
                      color: "white",
                      backgroundColor: theme.colors.glass.light,
                    }}
                    arrowicon={
                      <Ionicons name="chevron-down" size={20} color="white" />
                    }
                    searchicon={
                      <Ionicons name="search" size={20} color="white" />
                    }
                  />
                </YStack>
              </YStack>
            </YStack>
          </GlassCard>

          {/* Products Grid */}
          <YStack space="$4">
            {error ? (
              <Text color={theme.colors.text.error} fontSize="$4" textAlign="center">
                {error}
              </Text>
            ) : loading ? (
              <Text color={theme.colors.text.secondary} fontSize="$4" textAlign="center">
                Loading products...
              </Text>
            ) : products.length === 0 ? (
              <Text color={theme.colors.text.secondary} fontSize="$4" textAlign="center">
                No products found
              </Text>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  navigation={navigation}
                  onAddToCart={handleAddToCart}
                />
              ))
            )}
          </YStack>

          {/* Pagination - Updated UI */}
          <GlassCard padding="$4">
            <XStack 
              justifyContent="space-between" 
              alignItems="center" 
              width="100%"
            >
              <Button
                size="$4"
                disabled={currentPage === 1}
                onPress={() => setCurrentPage(prev => prev - 1)}
                backgroundColor={theme.colors.glass.light}
                borderColor={theme.colors.glass.border}
                opacity={currentPage === 1 ? 0.5 : 1}
                icon={<Ionicons name="chevron-back" size={20} color={theme.colors.text.primary} />}
                pressStyle={{ opacity: 0.8 }}
              >
                Prev
              </Button>

              <YStack alignItems="center">
                <Text 
                  color={theme.colors.text.primary} 
                  fontSize="$4" 
                  fontWeight="bold"
                >
                  {totalPages > 0 ? `${currentPage}/${totalPages}` : '0/0'}
                </Text>
                <Text 
                  color={theme.colors.text.secondary} 
                  fontSize="$3"
                >
                  {products.length} items
                </Text>
              </YStack>

              <Button
                size="$4"
                disabled={currentPage === totalPages || totalPages === 0}
                onPress={() => setCurrentPage(prev => prev + 1)}
                backgroundColor={theme.colors.glass.light}
                borderColor={theme.colors.glass.border}
                opacity={currentPage === totalPages ? 0.5 : 1}
                icon={<Ionicons name="chevron-forward" size={20} color={theme.colors.text.primary} />}
                pressStyle={{ opacity: 0.8 }}
              >
                Next
              </Button>
            </XStack>
          </GlassCard>
        </YStack>
      </ScrollView>
    </ScreenLayout>
  );
}

// ProductCard component remains the same but with updated props
function ProductCard({ product, navigation, onAddToCart }) {
  return (
    <GlassCard
      pressStyle={{ scale: 0.98 }}
      onPress={() => navigation.navigate("ProductDetails", { product })}
      padding={0}
      overflow="hidden"
    >
      <Image
        source={{ uri: product.imageUrl.url }}
        style={{
          width: "100%",
          height: 200,
          borderTopLeftRadius: theme.layout.radius.large,
          borderTopRightRadius: theme.layout.radius.large,
        }}
        resizeMode="cover"
      />
      <YStack padding="$4" space="$2">
        <Text color={theme.colors.text.primary} fontSize="$5" fontWeight="bold">
          {product.name}
        </Text>
        <Text color={theme.colors.text.secondary} fontSize="$3">
          {product.description}
        </Text>
        <XStack justifyContent="space-between" alignItems="center">
          <Text color={theme.colors.text.accent} fontSize="$5" fontWeight="bold">
            PKR {product.price}
          </Text>
        </XStack>
        <Button
          size="$4"
          backgroundColor={theme.colors.secondary.yellow}
          color={theme.colors.primary.dark}
          onPress={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          disabled={product.stock <= 0}
          icon={<Ionicons name="cart" size={20} color={theme.colors.primary.dark} />}
          marginTop="$2"
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </YStack>
    </GlassCard>
  );
}
