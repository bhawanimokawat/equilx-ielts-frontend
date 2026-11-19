const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

/**
 * Returns a user-friendly message for any error.
 * Handles the backend shapes: { error: { message } }, { message },
 * and validation lists like { errors: [{ message }] }.
 */
export function getErrorMessage(error, fallback = DEFAULT_MESSAGE) {
  if (!error) return fallback;

  // Request timed out
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return "The server took too long to respond. Please try again.";
  }

  // No response at all: the backend is off or the internet is down
  if (error.isAxiosError && !error.response) {
    return "Cannot reach the server. Check your internet connection and try again.";
  }

  // Not an axios error (for example a normal Error we threw ourselves)
  if (!error.response) {
    return error.message || fallback;
  }

  const { status, data } = error.response;

  if (status >= 500) {
    return "Something went wrong on our server. Please try again later.";
  }

  if (status === 429) {
    return (
      data?.error?.message ||
      data?.message ||
      "Too many attempts. Please wait a few minutes and try again."
    );
  }

  // Validation errors: show the first specific message
  if (Array.isArray(data?.errors) && data.errors[0]?.message) {
    return data.errors[0].message;
  }

  return data?.error?.message || data?.message || fallback;
}

// Returns the backend error code, for example "EMAIL_ALREADY_REGISTERED"
export function getErrorCode(error) {
  return error?.response?.data?.error?.code || error?.response?.data?.code || null;
}