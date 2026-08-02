import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { type ErrorCode } from "@/shared/utils/error-handler";

export function useAppToast() {
  const tError = useTranslations("Errors");
  const tNotify = useTranslations("Notifications");

  return {
    showError: (code: ErrorCode) => {
      toast.error(tError(code));
    },
    showNotification: (key: string) => {
      toast.success(tNotify(key));
    },
  };
}
