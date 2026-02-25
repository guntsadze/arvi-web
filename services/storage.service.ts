import { apiClient } from "@/lib/api";
import axios from "axios";

export const storageService = {
  getSignature: async (folder: string) => {
    const response = await apiClient.get(`/storage/signature?folder=${folder}`);
    return response;
  },

  uploadFile: async (file: File, folder: string) => {
    try {
      const sigData: any = await storageService.getSignature(folder);

      if (!sigData || !sigData.apiKey) {
        throw new Error("Could not get upload signature");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp.toString());
      formData.append("signature", sigData.signature);
      formData.append("folder", folder);

      // მნიშვნელოვანი: "image/upload" შეცვალე "auto/upload"-ით, რომ ვიდეოც აიტვირთოს
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`,
        formData,
      );

      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
        format: response.data.format,
        bytes: response.data.bytes,
        mediaType: response.data.resource_type.toUpperCase(),
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  },
};
