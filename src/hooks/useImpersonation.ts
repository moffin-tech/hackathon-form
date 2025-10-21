import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchLogoutUser } from "@/redux/features/authenticationSlice";

export const useImpersonation = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((store) => store.authentication);

  // For now, we'll assume impersonation is handled by the API
  // You might need to add impersonation flags to your user object
  const isImpersonating = false; // This should be determined by your API response
  const impersonatedUserId = null; // This should come from your API response
  const currentUserId = user?.id?.toString();

  const stopImpersonating = async () => {
    try {
      dispatch(
        fetchLogoutUser({
          onSuccess: () => {
            router.push("/admin/login");
          },
        })
      );
    } catch (error) {
      console.error("Error stopping impersonation:", error);
    }
  };

  const getEffectiveUserId = () => {
    return isImpersonating ? impersonatedUserId : currentUserId;
  };

  const getEffectiveUserInfo = () => {
    if (isImpersonating) {
      return {
        id: impersonatedUserId,
        isImpersonated: true,
        originalUserId: currentUserId,
      };
    }
    return {
      id: currentUserId,
      isImpersonated: false,
    };
  };

  return {
    isImpersonating,
    impersonatedUserId,
    currentUserId,
    stopImpersonating,
    getEffectiveUserId,
    getEffectiveUserInfo,
  };
};
