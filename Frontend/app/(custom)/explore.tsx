import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const categories = ["Entertainment", "Sports", "Politics", "Technology"];

const newsItems = [
  {
    id: "1",
    title: "Breaking News: Major Event Unfolds",
    image: "https://via.placeholder.com/300x200",
    source: "NewsSource",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    likes: 1234,
    views: 5678,
  },
  {
    id: "2",
    title: "Breaking News: Major Event Unfolds",
    image: "https://via.placeholder.com/300x200",
    source: "NewsSource",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    likes: 1234,
    views: 5678,
  },
];

const NewsFeed = () => {
  const [activeCategory, setActiveCategory] = useState("Entertainment");

  const renderCategoryIcon = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.categoryIcon,
        activeCategory === item && styles.activeCategoryIcon,
      ]}
      onPress={() => setActiveCategory(item)}
    >
      <Ionicons
        name="newspaper-outline"
        size={24}
        color={activeCategory === item ? "white" : "black"}
      />
    </TouchableOpacity>
  );

  const renderNewsItem = ({ item }: any) => (
    <View style={styles.newsItem}>
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <View style={styles.overlay}>
        <Text style={styles.newsTitle}>{item.title}</Text>
      </View>
      <View style={styles.newsContent}>
        <Image
          source={{ uri: "https://via.placeholder.com/50x50" }}
          style={styles.sourceImage}
        />
        <Text style={styles.newsText}>{item.content}</Text>
      </View>
      <View style={styles.newsFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="eye-outline" size={18} color="gray" />
          <Text style={styles.footerText}>{item.views}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="heart-outline" size={18} color="gray" />
          <Text style={styles.footerText}>{item.likes}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="share-social-outline" size={18} color="gray" />
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="chatbubble-outline" size={18} color="gray" />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#999"
        />
        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesText}>Categories</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </View>
        <FlatList
          data={categories}
          renderItem={renderCategoryIcon}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesIconList}
        />
      </View>
      <View style={styles.categoryTabs}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setActiveCategory(category)}
            style={[
              styles.categoryTab,
              activeCategory === category && styles.activeCategoryTab,
            ]}
          >
            <Text
              style={[
                styles.categoryTabText,
                activeCategory === category && styles.activeCategoryTabText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={styles.content}>
        <FlatList
          data={newsItems}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchBar: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoriesText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  categoriesIconList: {
    paddingVertical: 8,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activeCategoryIcon: {
    backgroundColor: "#007AFF",
  },
  content: {
    flex: 1,
  },
  categoryTabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryTab: {
    marginRight: 16,
    paddingVertical: 8,
  },
  activeCategoryTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  categoryTabText: {
    fontSize: 16,
    color: "#666",
  },
  activeCategoryTabText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  newsItem: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    marginHorizontal: 16,
  },
  newsImage: {
    width: "100%",
    height: 200,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
    padding: 16,
  },
  newsTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  newsContent: {
    flexDirection: "row",
    padding: 16,
  },
  sourceImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  newsText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  newsFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    marginLeft: 4,
    color: "gray",
  },
});

export default NewsFeed;
