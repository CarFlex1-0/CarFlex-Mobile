import React, { useState, useEffect } from "react";
import { ScrollView, RefreshControl, Image, Dimensions } from "react-native";
import { Text, YStack, XStack, Button, Input, Adapt, Sheet } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "../../components/common/GlassCard";
import theme from "../../constants/theme";
import ScreenLayout from "../../components/common/ScreenLayout";
import { ChevronDown, ChevronUp, Check } from "@tamagui/lucide-icons";
import { SelectList } from "react-native-dropdown-select-list";

const { width } = Dimensions.get("window");

// Pakistani Brands and Categories
const PAKISTANI_BRANDS = [
  "All",
  "Millat Tractors",
  "Honda Atlas",
  "Toyota Indus",
  "Pak Suzuki",
  "Master Motors",
  "Al-Haj FAW",
];

const PRODUCT_CATEGORIES = [
  "All",
  "Engine Parts",
  "Suspension",
  "Brakes",
  "Electrical",
  "Body Parts",
  "Interior",
];

// Extended mock data
const MOCK_PRODUCTS = [
  {
    _id: "1",
    name: "Turbocharged Engine Kit",
    description:
      "High-performance turbocharged engine kit for better acceleration",
    price: 1999.99,
    category: "Engine Parts",
    brand: "Honda Atlas",
    stock: 5,
    rating: 4.8,
    status: "available",
    image: "https://images.unsplash.com/photo-1613067921628-0cc5d63c218f",
  },
  {
    _id: "2",
    name: "Hydraulic Brake Set",
    description: "Durable hydraulic brakes for enhanced safety",
    price: 499.99,
    category: "Brakes",
    brand: "Toyota Indus",
    stock: 12,
    rating: 4.6,
    status: "available",
    image: "https://images.unsplash.com/photo-1589652715938-570f94dd6f9b",
  },
  {
    _id: "3",
    name: "Shock Absorber Kit",
    description: "Premium shock absorbers for smooth rides",
    price: 299.99,
    category: "Suspension",
    brand: "Millat Tractors",
    stock: 20,
    rating: 4.3,
    status: "available",
    image: "https://images.unsplash.com/photo-1604594849807-dac1e82b4576",
  },
  {
    _id: "4",
    name: "LED Headlights",
    description: "Energy-efficient LED headlights with extended life",
    price: 199.99,
    category: "Electrical",
    brand: "Pak Suzuki",
    stock: 30,
    rating: 4.7,
    status: "available",
    image: "https://images.unsplash.com/photo-1542364787-90ec74847fcb",
  },
  {
    _id: "5",
    name: "Car Interior Mat Set",
    description: "Luxury interior mat set for comfortable rides",
    price: 89.99,
    category: "Interior",
    brand: "Master Motors",
    stock: 25,
    rating: 4.4,
    status: "available",
    image: "https://images.unsplash.com/photo-1563729784474-4fbd6a69b3d5",
  },
  {
    _id: "6",
    name: "Steel Bumper Guard",
    description: "Heavy-duty bumper guard for extra protection",
    price: 149.99,
    category: "Body Parts",
    brand: "Al-Haj FAW",
    stock: 18,
    rating: 4.5,
    status: "available",
    image: "https://images.unsplash.com/photo-1587301479645-cfb6c3df45d6",
  },
  {
    _id: "7",
    name: "Performance Spark Plugs",
    description: "Boost engine efficiency with advanced spark plugs",
    price: 59.99,
    category: "Engine Parts",
    brand: "Toyota Indus",
    stock: 50,
    rating: 4.9,
    status: "available",
    image: "https://images.unsplash.com/photo-1558586593-06ba408bf9e1",
  },
  {
    _id: "8",
    name: "Disk Brake Rotors",
    description: "Durable brake rotors for smooth braking",
    price: 229.99,
    category: "Brakes",
    brand: "Pak Suzuki",
    stock: 10,
    rating: 4.2,
    status: "available",
    image: "https://images.unsplash.com/photo-1579985462102-5a94368a17c7",
  },
  {
    _id: "9",
    name: "Custom Steering Wheel",
    description: "Ergonomic steering wheel for ultimate control",
    price: 149.99,
    category: "Interior",
    brand: "Honda Atlas",
    stock: 14,
    rating: 4.5,
    status: "available",
    image: "https://images.unsplash.com/photo-1576866209838-2bb52a92fefc",
  },
  {
    _id: "10",
    name: "Fuel Injector System",
    description: "Efficient fuel injector system for better mileage",
    price: 549.99,
    category: "Engine Parts",
    brand: "Millat Tractors",
    stock: 8,
    rating: 4.7,
    status: "available",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753",
  },
  {
    _id: "11",
    name: "LED Taillights",
    description: "Bright LED taillights for improved visibility",
    price: 179.99,
    category: "Electrical",
    brand: "Master Motors",
    stock: 22,
    rating: 4.4,
    status: "available",
    image: "https://images.unsplash.com/photo-1582794360322-ef13b723e240",
  },
  {
    _id: "12",
    name: "Side Mirrors",
    description: "Adjustable side mirrors for better road safety",
    price: 99.99,
    category: "Body Parts",
    brand: "Al-Haj FAW",
    stock: 15,
    rating: 4.1,
    status: "available",
    image: "https://images.unsplash.com/photo-1592925176926-93606ff6b8c6",
  },
  {
    _id: "13",
    name: "Sporty Seat Covers",
    description: "High-quality seat covers for a sporty look",
    price: 79.99,
    category: "Interior",
    brand: "Toyota Indus",
    stock: 16,
    rating: 4.6,
    status: "available",
    image: "https://images.unsplash.com/photo-1589383343352-47eb83d36e57",
  },
  {
    _id: "14",
    name: "Ball Joint Assembly",
    description: "High-durability ball joints for steering linkage",
    price: 119.99,
    category: "Suspension",
    brand: "Pak Suzuki",
    stock: 30,
    rating: 4.3,
    status: "available",
    image: "https://images.unsplash.com/photo-1607537231262-8b3af3501e62",
  },
  {
    _id: "15",
    name: "Ceramic Brake Pads",
    description: "Long-lasting ceramic brake pads for quiet performance",
    price: 99.99,
    category: "Brakes",
    brand: "Honda Atlas",
    stock: 20,
    rating: 4.8,
    status: "available",
    image: "https://images.unsplash.com/photo-1585238349506-d4fdc87b53f7",
  },
  {
    _id: "16",
    name: "Front Grill",
    description: "Stylish front grill for a modern look",
    price: 199.99,
    category: "Body Parts",
    brand: "Millat Tractors",
    stock: 10,
    rating: 4.7,
    status: "available",
    image: "https://images.unsplash.com/photo-1558389991-586e5f608367",
  },
  {
    _id: "17",
    name: "Ignition Coil Pack",
    description: "Premium ignition coils for smooth engine startups",
    price: 349.99,
    category: "Electrical",
    brand: "Al-Haj FAW",
    stock: 12,
    rating: 4.2,
    status: "available",
    image: "https://images.unsplash.com/photo-1613067853729-1678cbd3dcae",
  },
  {
    _id: "18",
    name: "Anti-Roll Bar Kit",
    description: "Sturdy anti-roll bars for vehicle stability",
    price: 259.99,
    category: "Suspension",
    brand: "Toyota Indus",
    stock: 8,
    rating: 4.6,
    status: "available",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",
  },
  {
    _id: "19",
    name: "Power Window Motors",
    description: "Efficient window motors for smooth operation",
    price: 129.99,
    category: "Electrical",
    brand: "Master Motors",
    stock: 20,
    rating: 4.4,
    status: "available",
    image: "https://images.unsplash.com/photo-1586212761693-9ef0f2735c12",
  },
  {
    _id: "20",
    name: "Sports Alloy Rims",
    description: "Lightweight and durable alloy rims for a sporty look",
    price: 599.99,
    category: "Body Parts",
    brand: "Pak Suzuki",
    stock: 10,
    rating: 4.8,
    status: "available",
    image: "https://images.unsplash.com/photo-1582837616565-60e9d66db8ef",
  },
];

// Format data for SelectList
const CATEGORY_DATA = PRODUCT_CATEGORIES.map((category) => ({
  key: category,
  value: category,
}));

const BRAND_DATA = PAKISTANI_BRANDS.map((brand) => ({
  key: brand,
  value: brand,
}));

export default function MarketplaceScreen({ navigation }) {
  // State declarations
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(MOCK_PRODUCTS.length / 10)
  );
  const itemsPerPage = 10;

  // Get filtered products
  const getFilteredProducts = () => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesBrand =
        selectedBrand === "All" || product.brand === selectedBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    });
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const filtered = getFilteredProducts();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Calculate totals
  const filteredProducts = getFilteredProducts();
  const paginatedProducts = getCurrentPageItems();
  const totalItems = filteredProducts.length;

  // Effect to reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    const filtered = getFilteredProducts();
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [searchQuery, selectedCategory, selectedBrand]);

  // Fetch products function with pagination reset
  const fetchProducts = async () => {
    setLoading(true);
    try {
      /* 
      BACKEND INTEGRATION:
      const response = await axiosInstance.get('/products', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          brand: selectedBrand !== 'All' ? selectedBrand : undefined,
          search: searchQuery
        }
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      */

      // For mock data
      const filtered = products.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "All" || product.category === selectedCategory;
        const matchesBrand =
          selectedBrand === "All" || product.brand === selectedBrand;
        return matchesSearch && matchesCategory && matchesBrand;
      });

      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  return (
    <ScreenLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchProducts} />
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
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                navigation={navigation}
              />
            ))}
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
                  {totalItems} items
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

// ProductCard Component
function ProductCard({ product, navigation }) {
  return (
    <GlassCard
      pressStyle={{ scale: 0.98 }}
      onPress={() => navigation.navigate("ProductDetails", { product })}
      padding={0}
      overflow="hidden"
    >
      <Image
        source={{ uri: product.image }}
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
          <XStack space="$2" alignItems="center">
            <Ionicons
              name="star"
              size={16}
              color={theme.colors.secondary.yellow}
            />
            <Text color={theme.colors.text.primary} fontSize="$3">
              {product.rating}
            </Text>
          </XStack>
          <Text
            color={theme.colors.text.accent}
            fontSize="$5"
            fontWeight="bold"
          >
            ${product.price}
          </Text>
        </XStack>
        <Button
          size="$4"
          backgroundColor={theme.colors.secondary.yellow}
          color={theme.colors.primary.dark}
          onPress={(e) => {
            e.stopPropagation();
            navigation.navigate("Cart");
          }}
          icon={
            <Ionicons name="cart" size={20} color={theme.colors.primary.dark} />
          }
          marginTop="$2"
        >
          Add to Cart
        </Button>
      </YStack>
    </GlassCard>
  );
}
