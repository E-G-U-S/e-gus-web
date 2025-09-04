import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native"

const Button = ({
  children,
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  onPress,
  style,
  textStyle,
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return styles.primary
      case "secondary":
        return styles.secondary
      case "outline":
        return styles.outline
      case "ghost":
        return styles.ghost
      case "link":
        return styles.link
      case "destructive":
        return styles.destructive
      default:
        return styles.primary
    }
  }

  const getVariantTextStyle = () => {
    switch (variant) {
      case "primary":
        return styles.primaryText
      case "secondary":
        return styles.secondaryText
      case "outline":
        return styles.outlineText
      case "ghost":
        return styles.ghostText
      case "link":
        return styles.linkText
      case "destructive":
        return styles.destructiveText
      default:
        return styles.primaryText
    }
  }

  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return styles.sm
      case "lg":
        return styles.lg
      case "icon":
        return styles.icon
      default:
        return styles.default
    }
  }

  const getSizeTextStyle = () => {
    switch (size) {
      case "sm":
        return styles.smText
      case "lg":
        return styles.lgText
      case "icon":
        return styles.iconText
      default:
        return styles.defaultText
    }
  }

  return (
    <TouchableOpacity
      style={[styles.button, getVariantStyle(), getSizeStyle(), disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" || variant === "link" ? "#2d5d3d" : "#fff"}
        />
      ) : (
        <Text style={[getVariantTextStyle(), getSizeTextStyle(), disabled && styles.disabledText, textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  // Variants
  primary: {
    backgroundColor: "#2d5d3d",
  },
  secondary: {
    backgroundColor: "#f1f5f9",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2d5d3d",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  link: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  destructive: {
    backgroundColor: "#ef4444",
  },
  // Sizes
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  default: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  lg: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 0,
  },
  // Text styles
  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryText: {
    color: "#334155",
    fontWeight: "600",
  },
  outlineText: {
    color: "#2d5d3d",
    fontWeight: "600",
  },
  ghostText: {
    color: "#2d5d3d",
    fontWeight: "600",
  },
  linkText: {
    color: "#2d5d3d",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  destructiveText: {
    color: "#fff",
    fontWeight: "600",
  },
  // Text sizes
  smText: {
    fontSize: 14,
  },
  defaultText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
  iconText: {
    fontSize: 16,
  },
  // Disabled
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
})

export default Button
