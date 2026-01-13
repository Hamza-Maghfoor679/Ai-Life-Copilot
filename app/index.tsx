// Index.tsx
import { RootState } from "@/src/redux/store";
import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function Index() {
  // Get authentication state from Redux
  const token = useSelector((state: RootState) => state.user.user?.token);

  console.log("Auth token in Index:", token);

  // If token exists, user is logged in → go to main
  if (token) {
    return <Redirect href="/(main)" />;
  }

  // Otherwise, redirect to auth
  return <Redirect href="/(auth)" />;
}
