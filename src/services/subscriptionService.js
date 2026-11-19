
import { request } from "./authService1";

const subscriptionService = {
  // Available plans and current effective plan versions
  getPlans: () => request("/plans?ownerType=INDIVIDUAL"),

  // Logged-in user's active personal subscription
  getMySubscription: () => request("/subscriptions/me"),

  // Create a Razorpay order for an individual paid plan
  createPaymentOrder: (planVersionId, idempotencyKey) =>
    request("/payments/orders", {
      method: "POST",
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({ planVersionId }),
    }),

  // Verify payment after Razorpay Checkout returns
  verifyPayment: (payload) =>
    request("/payments/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export default subscriptionService;
