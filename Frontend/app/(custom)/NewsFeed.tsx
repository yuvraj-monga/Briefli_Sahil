import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  Share,
  Clipboard,
  Modal,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import {
  LongPressGestureHandler,
  State,
  TextInput,
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Toast from "react-native-simple-toast";
import ShareSvgComponent from "../../Components/ShareSvg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ref, set, push, get } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";

const { height, width } = Dimensions.get("window");

export default function NewsFeed() {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scrollY] = useState(new Animated.Value(0));
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [viewableItem, setViewableItem] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const flatListRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [currentNewsStartTime, setCurrentNewsStartTime] = useState(null);

  const [timeouts, setTimeouts] = useState({});

  const [newsData, setNewsData] = useState([
    {
      id: "1",
      title:
        "Poll: Gender gap, enthusiasm, economy make for tight Harris-Trump race",
      content:
        "When Kamala Harris became the Democratic presidential nominee, the party saw a major surge in enthusiasm from its voters.",
      url: "https://www.cbsnews.com/news/new-poll-kamala-harris-policies-trump-democratic-convention-2024/",
      imageUrl:
        "https://assets2.cbsnewsstatic.com/hub/i/r/2024/08/19/06d41c03-476e-48b9-849c-003923e8e183/thumbnail/1280x720/19e7fe1fbe3447f665ee93154a8e2081/0818-wn-jiang.jpg?v=29ebd300d9a3cd24077d945a46991f72",
      sourceImg:
        "https://res.cloudinary.com/de64bqt7n/image/upload/v1731944207/download_prev_ui_kk0nhd.png",
      views: 100,
      likes: 25,
      viewCountIncreased: false,
      viewAnimation: new Animated.Value(1),
      likeAnimation: new Animated.Value(1),
      category: "Politics",
    },
    {
      id: "2",
      title:
        "Former aide H.R. McMaster on how Trump enjoys 'pitting people against each other'",
      content:
        "In a new book, former national security adviser H.R. McMaster describes a White House where 'everything ... was much harder than it needed to be.' McMaster was happy to serve and eager to reverse what he considered President Obama's 'weak-kneed' foreign policy. McMaster never considered Trump 'dangerous,' but the president's affinity for autocrats made him uneasy.",
      url: "https://www.cbsnews.com/news/h-r-mcmaster-at-war-with-ourselves-my-tour-of-duty-in-the-trump-white-house/",
      imageUrl:
        "https://assets3.cbsnewsstatic.com/hub/i/r/2024/08/18/362f4bf5-7788-4279-a11c-aff0293b0db5/thumbnail/620x349/6f72b3fbb9a8c9043166b67b0c546c2a/trump-mcmaster-ap-17167521509605-widw.jpg?v=29ebd300d9a3cd24077d945a46991f72",
      sourceImg:
        "https://res.cloudinary.com/de64bqt7n/image/upload/v1723672874/news-images/h7re3x8qfzdipoxjohdq.png",
      views: 100,
      likes: 25,
      viewCountIncreased: false,
      viewAnimation: new Animated.Value(1),
      likeAnimation: new Animated.Value(1),
      category: "Politics",
    },
    {
      id: "3",
      title:
        "Poll: Gender gap, enthusiasm, economy make for tight Harris-Trump race",
      content:
        "When Kamala Harris became the Democratic presidential nominee, the party saw a major surge in enthusiasm from its voters.",
      url: "https://www.cbsnews.com/news/new-poll-kamala-harris-policies-trump-democratic-convention-2024/",
      imageUrl:
        "https://assets2.cbsnewsstatic.com/hub/i/r/2024/08/19/06d41c03-476e-48b9-849c-003923e8e183/thumbnail/1280x720/19e7fe1fbe3447f665ee93154a8e2081/0818-wn-jiang.jpg?v=29ebd300d9a3cd24077d945a46991f72",
      sourceImg:
        "https://res.cloudinary.com/de64bqt7n/image/upload/v1723672874/news-images/h7re3x8qfzdipoxjohdq.png",
      views: 100,
      likes: 26,
      viewCountIncreased: false,
      viewAnimation: new Animated.Value(1),
      likeAnimation: new Animated.Value(1),
      category: "Politics",
    },
  ]);

  useEffect(() => {
    const generateUserId = async () => {
      let id = await AsyncStorage.getItem("userId");
      if (!id) {
        id = `user_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem("userId", id);
      }
      setUserId(id);
    };

    generateUserId();
  }, []);

  const sanitizeTitle = (title: string) => {
    return title.replace(/[\.\$\#\[\]\/]/g, "_"); // Replace invalid characters with underscores
  };

  const trackTimeSpent = async (newsId, title, category) => {
    const currentTime = new Date().getTime();

    if (currentNewsStartTime) {
      const timeSpent = Math.round((currentTime - currentNewsStartTime) / 1000); // Time in seconds

      const sanitizedTitle = sanitizeTitle(title);

      // Firebase reference: users/userId/newsInteractions/title
      const userReadRef = ref(
        database,
        `users/${userId}/newsInteractions/${sanitizedTitle}`
      );

      // Fetch existing data for the current news article
      const snapshot = await get(userReadRef);

      let updatedTimeSpent = timeSpent; // Start with the current session time
      if (snapshot.exists()) {
        const data = snapshot.val();
        updatedTimeSpent += data.timeSpent; // Add current session time to existing time
      }

      // Update or set the new cumulative time spent in the Firebase
      await set(userReadRef, {
        newsId,
        category,
        timeSpent: updatedTimeSpent, // Cumulative time spent
      });
    }

    // Reset the start time for the next interaction
    setCurrentNewsStartTime(currentTime);
  };

  const [modalY] = useState(new Animated.Value(0));

  // State for modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);

  const handleGesture = ({ nativeEvent }: any) => {
    if (nativeEvent.translationY > 100) {
      closeModal();
    }
  };

  const closeModal = () => {
    Animated.timing(modalY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      modalY.setValue(0);
    });
  };

  const dummyComments = [
    {
      id: "1",
      username: "User1",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      text: "Great article! Thanks for sharing.",
      time: "10:15 AM",
    },
    {
      id: "2",
      username: "User2",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      text: "I completely agree with your points.",
      time: "11:30 AM",
    },
    {
      id: "3",
      username: "User3",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      text: "Can you provide more details on this topic?",
      time: "1:45 PM",
    },
    {
      id: "4",
      username: "User4",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      text: "This was very informative!",
      time: "3:20 PM",
    },
  ];

  const [comments, setComments] = useState(dummyComments);
  const [commentText, setCommentText] = useState("");

  const addComment = () => {
    if (commentText.trim() !== "") {
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const newCommentData = {
        id: (comments.length + 1).toString(),
        username: "New User",
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        text: commentText,
        time: time,
      };
      setComments([...comments, newCommentData]);
      setCommentText("");
    }
  };

  const handleTransition = (direction: any) => {
    Animated.timing(fadeAnim, {
      toValue: direction === "in" ? 0.8 : 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(offsetY > 200);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const toggleDropdown = (id: any) => {
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  const handleLongPress = (url: any) => {
    Clipboard.setString(url);
    Toast.show("Link copied to clipboard!", 2000, { textColor: "blue" });
  };

  const increaseViews = useCallback(
    (id) => {
      if (timeouts[id]) {
        clearTimeout(timeouts[id]);
      }

      const timeoutId = setTimeout(() => {
        setNewsData((prevData) =>
          prevData.map((item) =>
            item.id === id
              ? {
                  ...item,
                  views: item.views + 1,
                  viewCountIncreased: true,
                }
              : item
          )
        );

        Animated.sequence([
          Animated.timing(
            newsData.find((item) => item.id === id).viewAnimation,
            {
              toValue: 1.2,
              duration: 200,
              useNativeDriver: true,
            }
          ),
          Animated.timing(
            newsData.find((item) => item.id === id).viewAnimation,
            {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }
          ),
        ]).start();
      }, 8000);

      setTimeouts((prev) => ({ ...prev, [id]: timeoutId }));
    },
    [newsData, timeouts]
  );

  const handleLike = (id: any) => {
    setNewsData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              likes: item.likes + 1,
              liked: true,
            }
          : item
      )
    );

    // Trigger like button animation
    Animated.sequence([
      Animated.timing(newsData.find((item) => item.id === id).likeAnimation, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(newsData.find((item) => item.id === id).likeAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 70,
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: any) => {
      if (viewableItems.length > 0) {
        const visibleItem = viewableItems[0].item;
        if (!visibleItem.viewCountIncreased) {
          increaseViews(visibleItem.id);
          setViewableItem(visibleItem.id);
          trackTimeSpent(
            visibleItem.id,
            visibleItem.title,
            visibleItem.category,
          );
        }
      }
    },
    [increaseViews, userId]
  );

  const handleIndexChange = (index: any) => {
    setCurrentNewsIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.newsContainer}>
      <FlatList
        data={[{ type: "summary" }, { type: "webview" }]}
        horizontal
        pagingEnabled
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        decelerationRate={"normal"}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(innerItem) => innerItem.type}
        onScroll={({ nativeEvent }) => {
          const currentIndex = Math.round(nativeEvent.contentOffset.x / width);
          setScrollEnabled(currentIndex === 0);
          handleTransition(currentIndex === 0 ? "out" : "in");
        }}
        renderItem={({ item: innerItem }) =>
          innerItem.type === "summary" ? (
            <LongPressGestureHandler
              onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.ACTIVE) {
                  handleLongPress(item.url);
                }
              }}
            >
              <Animated.View
                style={[styles.summaryContainer, { opacity: fadeAnim }]}
              >
                {/* Image Section */}
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <View style={styles.overlayContainer}>
                    <Text
                      style={styles.title}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.title}
                    </Text>
                  </View>
                </View>

                {/* Description Section */}
                <View style={styles.newsDesc}>
                  <Image
                    source={{ uri: item.sourceImg }}
                    style={styles.sourceImage}
                    resizeMode="contain"
                  />
                  <Text
                    style={styles.content}
                    numberOfLines={7}
                    ellipsizeMode="tail"
                  >
                    {item.content}
                  </Text>
                </View>

                {/* Ellipsis Button */}
                <TouchableOpacity
                  style={styles.ellipsisButton}
                  onPress={() => toggleDropdown(item.id)}
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>

                {dropdownVisible === item.id && (
                  <View style={styles.dropdownMenu}>
                    <View>
                      <Text style={styles.dropdownText1}>
                        See similar stories
                      </Text>
                    </View>
                    <View style={styles.dropdownContainer}>
                      <TouchableOpacity style={styles.dropdownButton}>
                        <Ionicons
                          name="remove-outline"
                          size={24}
                          color="white"
                        />
                        <Text style={styles.dropdownButtonText}>Less</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.dropdownButton}>
                        <Ionicons name="add-outline" size={24} color="white" />
                        <Text style={styles.dropdownButtonText}>More</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.dropdownItem}>
                      <Text style={styles.dropdownText}>Bookmark</Text>
                      <TouchableOpacity>
                        <Ionicons
                          name="bookmark-outline"
                          size={24}
                          color="white"
                          style={styles.iconStyle}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.dropdownItem}>
                      <Text style={styles.dropdownText}>Share</Text>
                      <TouchableOpacity>
                        <Ionicons
                          name="share-outline"
                          size={24}
                          color="white"
                          onPress={() =>
                            Share.share({
                              message: `Check out this news: ${item.url}`,
                            })
                          }
                          style={styles.iconStyle}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.dropdownItem1}>
                      <Text style={styles.dropdownText}>Report</Text>
                      <TouchableOpacity>
                        <MaterialIcons
                          name="report"
                          size={24}
                          color="white"
                          style={styles.iconStyle}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <View style={styles.iconContainer}>
                  <View style={styles.iconGroup}>
                    <Animated.View
                      style={{
                        transform: [{ scale: item.viewAnimation }],
                      }}
                    >
                      <AntDesign
                        name="eyeo"
                        size={22}
                        color={item.viewCountIncreased ? "green" : "black"}
                      />
                    </Animated.View>
                    <Animated.Text
                      style={[
                        styles.iconText,
                        {
                          transform: [{ scale: item.viewAnimation }],
                        },
                      ]}
                    >
                      {item.views}
                      {item.viewCountIncreased && (
                        <Text style={styles.viewIncrease}>(1)</Text>
                      )}
                    </Animated.Text>
                  </View>
                  <View style={styles.iconGroup2}>
                    <View style={styles.subGroup}>
                      <ShareSvgComponent color="black" size={24} />
                    </View>
                    <View style={styles.subGroup}>
                      <TouchableOpacity onPress={() => handleLike(item.id)}>
                        <Animated.View
                          style={{
                            transform: [{ scale: item.likeAnimation }],
                          }}
                        >
                          <SimpleLineIcons
                            name="heart"
                            size={20}
                            color={item.liked ? "red" : "black"}
                          />
                        </Animated.View>
                      </TouchableOpacity>
                      <Animated.Text
                        style={[
                          styles.iconText,
                          {
                            transform: [{ scale: item.likeAnimation }],
                          },
                        ]}
                      >
                        {item.likes}
                      </Animated.Text>
                    </View>
                    <TouchableOpacity
                      style={styles.subGroup}
                      onPress={() => {
                        setSelectedNewsItem(item);
                        setModalVisible(true);
                      }}
                    >
                      <Ionicons
                        name="chatbubble-outline"
                        size={22}
                        color="black"
                      />
                      <Text style={styles.iconText}>{comments.length}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </LongPressGestureHandler>
          ) : (
            <WebView source={{ uri: item.url }} style={styles.webview} />
          )
        }
      />
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={newsData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="normal"
          scrollEnabled={scrollEnabled}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          onScroll={handleScroll}
        />
        {showScrollToTop && (
          <TouchableOpacity
            style={styles.scrollToTopButton}
            onPress={scrollToTop}
          >
            <AntDesign name="totop" size={18} color="white" />
            <Text style={styles.scrollToTopText}>scroll to top</Text>
          </TouchableOpacity>
        )}
        {/* <TextToSpeech newsData={newsData} onIndexChange={handleIndexChange} /> */}

        {/* Modal for Comments */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <PanGestureHandler onGestureEvent={handleGesture}>
            <Animated.View
              style={[
                styles.modalOverlay,
                {
                  transform: [{ translateY: modalY }],
                },
              ]}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderBar} />
                </View>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={closeModal}
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Comments</Text>

                <FlatList
                  data={comments}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.commentItem}>
                      <Image
                        source={{ uri: item.avatar }}
                        style={styles.commentAvatar}
                      />
                      <View style={styles.commentTextContainer}>
                        <Text style={styles.commentUsername}>
                          {item.username}
                        </Text>
                        <Text style={styles.commentText}>{item.text}</Text>
                        <Text style={styles.commentTime}>{item.time}</Text>
                      </View>
                    </View>
                  )}
                  contentContainerStyle={styles.commentsList}
                  showsVerticalScrollIndicator={false}
                />
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Add a comment..."
                    value={commentText}
                    onChangeText={setCommentText}
                  />
                  <TouchableOpacity onPress={addComment}>
                    <Ionicons name="send" size={24} color="blue" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </PanGestureHandler>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4ecec",
  },
  newsContainer: {
    height: height - 70,
    justifyContent: "center",
    backgroundColor: "#f4ecec",
  },
  summaryContainer: {
    width: width * 0.92,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fbf2f2",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 60,
    marginHorizontal: width * 0.04,
  },
  imageContainer: {
    width: width * 0.92,
    height: "60%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  overlayContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  title: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "left",
    fontFamily: "UbuntuBold",
  },
  newsDesc: {
    flexDirection: "column",
    alignSelf: "flex-start",
    marginTop: 4,
    marginHorizontal: 14,
  },
  sourceImage: {
    width: 50,
    height: 25,
    borderRadius: 5,
  },
  content: {
    fontSize: 16,
    fontFamily: "UbuntuMedium",
    color: "#555555",
    lineHeight: 18,
  },
  webview: {
    width,
    height,
  },
  ellipsisButton: {
    position: "absolute",
    top: 10,
    right: 12,
    padding: 10,
    backgroundColor: "#424140a0",
    borderRadius: 50,
  },
  dropdownMenu: {
    position: "absolute",
    top: 64,
    right: 16,
    backgroundColor: "#3f3837",
    borderRadius: 8,
    width: 200,
    zIndex: 100,
  },
  dropdownItem: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#76666183",
  },
  dropdownText: {
    color: "white",
    fontSize: 16,
    flex: 1,
    fontFamily: "UbuntuMedium",
    textAlign: "left",
    marginLeft: 10,
  },
  dropdownItem1: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    paddingVertical: 10,
  },
  dropdownText1: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    flex: 1,
    fontFamily: "UbuntuMedium",
    borderBottomWidth: 1,
    borderBottomColor: "#76666183",
    paddingVertical: 10,
  },
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#76666183",
  },
  dropdownButton: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  dropdownButtonText: {
    color: "white",
    fontSize: 14,
    marginBottom: 6,
    fontFamily: "UbuntuMedium",
  },
  iconStyle: {
    flex: 1,
    marginRight: 14,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginTop: 12,
    paddingHorizontal: 4,
    position: "absolute",
    bottom: 16,
    gap: 64,
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconGroup2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  subGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    fontSize: 18,
    color: "black",
    marginLeft: 5,
    textAlignVertical: "center",
  },
  viewIncrease: {
    fontSize: 18,
    marginLeft: 2,
    textAlign: "center",
  },
  scrollToTopButton: {
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
    backgroundColor: "#a39b9bd7",
    padding: 4,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  scrollToTopText: {
    fontSize: 16,
    fontFamily: "Ubuntu",
    color: "#faf3f3",
    marginLeft: 4,
    textAlignVertical: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: height * 0.6,
    backgroundColor: "#f7f3f3fa",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  modalHeaderBar: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
  },
  modalCloseButton: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "UbuntuBold",
  },
  commentsList: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
  },
  commentUsername: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  commentText: {
    color: "#555",
  },
  commentTime: {
    marginTop: 5,
    fontSize: 12,
    color: "#999",
    alignSelf: "flex-end",
    position: "absolute",
    top: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
