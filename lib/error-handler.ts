import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const serverResponse = error.response?.data;

    // თუ class-validator-იდან მოდის მასივი
    if (Array.isArray(serverResponse?.message)) {
      return serverResponse.message[0];
    }

    // თუ ერთი კონკრეტული მესიჯია
    if (typeof serverResponse?.message === "string") {
      return serverResponse.message;
    }
  }

  return error instanceof Error ? error.message : "უცნობი შეცდომა";
};
