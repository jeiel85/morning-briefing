import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  return {
    locale: locale ?? "ko",
    messages: (await import(`../messages/${locale ?? "ko"}.json`)).default,
  };
});
