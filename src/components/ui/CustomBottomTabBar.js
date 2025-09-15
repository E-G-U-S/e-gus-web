import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomBottomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconName = (() => {
            if (route.name === "Home") return isFocused ? "home" : "home-outline";
            if (route.name === "Search") return isFocused ? "search" : "search-outline";
           // if (route.name === "Map") return isFocused ? "map" : "map-outline";
            //if (route.name === "Notifications") return isFocused ? "notifications" : "notifications-outline";
           // if (route.name === "Profile") return isFocused ? "person" : "person-outline";
          })();

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tabItem, { flex: 1 }]}
            >
              <View style={[styles.tabIconContainer, isFocused && styles.tabIconContainerFocused]}>
                <Ionicons name={iconName} size={24} color={isFocused ? '#2d5d3d' : 'gray'} />
              </View>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
                {route.name === "Home" ? "Home" : route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 50, 
    backgroundColor: '#FFFFFF', 
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 6, // Reduzi de 8 para 6 para sombra mais sutil,
      },
    }),
    zIndex: 10,
  },
  tabBarContainer: {
    flexDirection: 'row',
    height: 50, 
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 5,
    justifyContent: 'center',
  },
  tabIconContainer: {
    paddingBottom: 2,
     marginTop: 8, 
  },
  tabIconContainerFocused: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tabLabel: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  tabLabelFocused: {
    color: '#2d5d3d',
    fontWeight: '500',
  },
});

export default CustomBottomTabBar;