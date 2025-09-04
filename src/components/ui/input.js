import React, { useState, useRef, useEffect } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity, Text, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Input = ({
  label,
  value,
  onChangeText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isInvalid,
  isValid,
  errorMessage,
  style,
  ...props
}) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const underlineWidth = useRef(new Animated.Value(0)).current;
  const errorOpacity = useRef(new Animated.Value(errorMessage ? 1 : 0)).current;
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: isFocused || value ? 1 : 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
      Animated.timing(underlineWidth, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isFocused, value, animatedValue, underlineWidth]);

  useEffect(() => {
    Animated.timing(errorOpacity, {
      toValue: errorMessage ? 1 : 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [errorMessage, errorOpacity]);

  const labelStyle = {
    position: 'absolute',
    left: leftIcon ? 40 : 15,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [12, -10],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#666', '#2d5d3d'],
    }),
    paddingHorizontal: 2,
    backgroundColor: '#f9f9f9',
    zIndex: 1,
  };

  const inputContainerStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isInvalid ? '#ef4444' : (isFocused ? '#2d5d3d' : (isValid && value ? '#2d5d3d' : '#e0e0e0')),
    position: 'relative',
    minHeight: 45,
    paddingVertical: 5,
  };

  const textInputStyle = {
    flex: 1,
    height: '100%',
    paddingLeft: leftIcon ? 45 : 15,
    paddingRight: rightIcon ? 45 : 15,
    color: '#333',
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
  };

  const underlineStyle = {
    position: 'absolute',
    bottom: -1,
    left: 0,
    height: 2,
    backgroundColor: '#2d5d3d',
    width: underlineWidth.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
  };

  return (
    <View style={[styles.container, style, { marginBottom: errorMessage ? 28 : 12 }]}>
      <View style={inputContainerStyle}>
        {label && (
          <Animated.Text style={labelStyle}>
            {label}
          </Animated.Text>
        )}
        {leftIcon && (
          <View style={[styles.icon, styles.iconLeft]}>
            {leftIcon}
          </View>
        )}
        <TextInput
          style={textInputStyle}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=""
          placeholderTextColor="#999"
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={[styles.icon, styles.iconRight]}>
            {rightIcon}
          </TouchableOpacity>
        )}
        <Animated.View style={underlineStyle} />
      </View>
      {errorMessage && (
        <Animated.View style={[styles.errorContainer, { opacity: errorOpacity }]}>
          <View style={styles.errorContent}>
            <Ionicons name="alert-circle-outline" size={14} color="#ef4444" style={styles.errorIcon} />
            <Text style={styles.errorMessageText}>
              {errorMessage}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  icon: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 2,
  },
  iconLeft: {
    left: 15,
  },
  iconRight: {
    right: 15,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 2,
    marginLeft: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#fee2e2',
    borderRadius: 5,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    marginRight: 4,
    marginTop: 1,
  },
  errorMessageText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
});

export default Input;