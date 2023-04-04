import React from "react";
import { SafeAreaView, ActivityIndicator } from "react-native";

const LoadingIndicator: React.FC = () => (
  <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#0000ff" />
  </SafeAreaView>
);

export default LoadingIndicator;
