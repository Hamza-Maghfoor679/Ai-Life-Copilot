import { RootState } from "@/src/redux/store";
import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function Index() {
  const token = useSelector((state: RootState) => state.user.user?.token);

  if (token) {
    return <Redirect href="/(main)" />;
  }

  return <Redirect href="/(auth)" />;
}
