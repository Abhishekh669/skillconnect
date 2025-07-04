import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  let errorMessage = "Something went wrong";
  
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with a status code outside 2xx
      errorMessage = error.response.data?.message || 
                    `Server responded with status ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "No response received from server";
    } else {
      // Error setting up the request
      errorMessage = `Request setup error: ${error.message}`;
    }
  } else if (error instanceof Error) {
    // Handle standard JavaScript errors
    errorMessage = error.message;
  } else if (typeof error === "string") {
    // Handle string error messages
    errorMessage = error;
  }

  console.error("Error details:", error);
  return errorMessage;
};