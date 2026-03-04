// src/services/revenueCatService.ts
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import Purchases, {
    CustomerInfo,
    LOG_LEVEL,
    PurchasesOfferings,
    PurchasesPackage,
} from "react-native-purchases";
import { Config } from "../config/env";
import { db } from "../config/firebase";

const API_KEY = Config.REVENUECAT_KEY;

class RevenueCatService {
  private initialized = false;

  /**
   * Initialize RevenueCat
   */
  async initialize(userId: string) {
    if (this.initialized) {
      console.log("ℹ️ RevenueCat already initialized");
      return;
    }

    try {
      console.log("🛒 Initializing RevenueCat...");

      // Enable debug logs (disable in production)
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Configure SDK
      await Purchases.configure({
        apiKey: API_KEY!,
        appUserID: userId, // Your user's unique ID
      });

      this.initialized = true;
      console.log("✅ RevenueCat initialized");

      // Listen for customer info updates
      Purchases.addCustomerInfoUpdateListener(async (customerInfo) => {
        console.log("📥 Customer info updated:", customerInfo);
        await this.updateUserSubscriptionStatus(userId, customerInfo);
      });
    } catch (error) {
      console.error("❌ RevenueCat initialization failed:", error);
      throw error;
    }
  }

  /**
   * Get available subscription offerings
   */
  async getOfferings(): Promise<PurchasesOfferings | null> {
    try {
      console.log("📦 Fetching offerings...");
      const offerings = await Purchases.getOfferings();

      if (offerings.current && offerings.current.availablePackages.length > 0) {
        console.log(
          "✅ Offerings fetched:",
          offerings.current.availablePackages.length,
        );
        return offerings;
      } else {
        console.log("⚠️ No offerings found");
        return null;
      }
    } catch (error) {
      console.error("❌ Error fetching offerings:", error);
      return null;
    }
  }

  /**
   * Purchase a package
   */
  async purchasePackage(pkg: PurchasesPackage) {
    try {
      console.log("🛍️ Purchasing package:", pkg.identifier);

      const { customerInfo } = await Purchases.purchasePackage(pkg);

      console.log("✅ Purchase successful");
      console.log(
        "  - Entitlements:",
        Object.keys(customerInfo.entitlements.active),
      );

      return customerInfo;
    } catch (error: any) {
      if (error.userCancelled) {
        console.log("ℹ️ User cancelled purchase");
        throw new Error("USER_CANCELLED");
      }

      console.error("❌ Purchase failed:", error);
      throw error;
    }
  }

  /**
   * Restore purchases
   */
  async restorePurchases() {
    try {
      console.log("🔄 Restoring purchases...");

      const customerInfo = await Purchases.restorePurchases();

      const activeSubscriptions = Object.keys(customerInfo.entitlements.active);

      if (activeSubscriptions.length > 0) {
        console.log("✅ Purchases restored:", activeSubscriptions);
        return customerInfo;
      } else {
        console.log("ℹ️ No active subscriptions found");
        return null;
      }
    } catch (error) {
      console.error("❌ Error restoring purchases:", error);
      throw error;
    }
  }

  /**
   * Check if user has active subscription
   */
  async checkSubscriptionStatus(): Promise<{
    isSubscribed: boolean;
    expirationDate?: Date;
    productId?: string;
  }> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();

      // Check if user has "premium" entitlement (you'll create this in RevenueCat dashboard)
      const premiumEntitlement = customerInfo.entitlements.active["premium"];

      if (premiumEntitlement) {
        return {
          isSubscribed: true,
          expirationDate: new Date(premiumEntitlement.expirationDate!),
          productId: premiumEntitlement.productIdentifier,
        };
      }

      return { isSubscribed: false };
    } catch (error) {
      console.error("❌ Error checking subscription:", error);
      return { isSubscribed: false };
    }
  }

  /**
   * Update user subscription status in Firestore
   */
  private async updateUserSubscriptionStatus(
    userId: string,
    customerInfo: CustomerInfo,
  ) {
    try {
      const premiumEntitlement = customerInfo.entitlements.active["premium"];

      const userRef = doc(db, "users", userId);

      if (premiumEntitlement) {
        // User has active subscription
        const isMonthly =
          premiumEntitlement.productIdentifier.includes("monthly");

        await updateDoc(userRef, {
          subscriptionStatus: "premium",
          subscriptionTier: isMonthly ? "monthly" : "yearly",
          subscriptionExpiresAt: Timestamp.fromDate(
            new Date(premiumEntitlement.expirationDate!),
          ),
          lastPurchaseDate: Timestamp.now(),
        });

        console.log("✅ User subscription updated to premium");
      } else {
        // User has no active subscription
        await updateDoc(userRef, {
          subscriptionStatus: "free",
          subscriptionTier: null,
          subscriptionExpiresAt: null,
        });

        console.log("✅ User subscription updated to free");
      }
    } catch (error) {
      console.error("❌ Error updating user subscription in Firestore:", error);
    }
  }

  /**
   * Get user's current customer info
   */
  async getCustomerInfo() {
    try {
      return await Purchases.getCustomerInfo();
    } catch (error) {
      console.error("❌ Error getting customer info:", error);
      return null;
    }
  }

  /**
   * Logout (call when user logs out)
   */
  async logout() {
    try {
      await Purchases.logOut();
      this.initialized = false;
      console.log("✅ RevenueCat logged out");
    } catch (error) {
      console.error("❌ Error logging out:", error);
    }
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService();
