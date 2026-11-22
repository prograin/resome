import { academyApp } from "../../src/features/academy-app/paths.js";

export async function installMockPush(
  context,
  subscription,
  { locale = "fa", theme = "dark", subscribed = false, permission = "default" } = {},
) {
  await context.addInitScript((key) => sessionStorage.setItem(key, "1"), academyApp.invitationKey);
  await context.addInitScript(
    ({ locale, theme, subscription, subscribed, permission }) => {
      localStorage.setItem("portfolio_locale", locale);
      localStorage.setItem("academy_theme", theme);
      const state = { requests: 0, lookups: 0, subscribed, permission };
      window.__pushTest = state;
      class MockNotification {
        static get permission() {
          return state.permission;
        }
        static async requestPermission() {
          state.requests++;
          state.permission = "granted";
          return "granted";
        }
      }
      const sub = {
        endpoint: subscription.endpoint,
        toJSON: () => subscription,
        unsubscribe: async () => {
          state.subscribed = false;
          return true;
        },
      };
      const registration = {
        scope: location.origin + "/academy/students/",
        active: {},
        pushManager: {
          getSubscription: async () => {
            state.lookups++;
            return state.subscribed ? sub : null;
          },
          subscribe: async () => {
            state.subscribed = true;
            return sub;
          },
        },
      };
      Object.defineProperty(window, "Notification", {
        configurable: true,
        value: MockNotification,
      });
      Object.defineProperty(window, "PushManager", { configurable: true, value: class {} });
      Object.defineProperty(navigator, "serviceWorker", {
        configurable: true,
        value: {
          getRegistration: async () => registration,
          register: async () => registration,
        },
      });
    },
    { locale, theme, subscription, subscribed, permission },
  );
}
