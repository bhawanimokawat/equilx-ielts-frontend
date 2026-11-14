export function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    const script = existingScript || document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => window.Razorpay ? resolve() : reject(new Error("Razorpay Checkout did not initialize."));
    script.onerror = () => reject(new Error("Could not load Razorpay Checkout."));
    if (!existingScript) document.body.appendChild(script);
  });
}
