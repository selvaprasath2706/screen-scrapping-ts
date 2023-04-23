import axios, { AxiosError } from "axios";
import {
  SuccessfulResponse,
  FailureResponse,
  requestConfig,
} from "../Schemas.js";

export const request = async (config: requestConfig) => {
  try {
    const response = await axios.request(config);
    if (response.status === 200) {
      const data: SuccessfulResponse = response?.data;
      return data;
    } else {
      const data: FailureResponse = response?.data;
      return Promise.reject(data);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        const data: FailureResponse = error.response?.data;
        return Promise.reject(data);
      } else {
        return Promise.reject({ error: error.message });
      }
    } else {
      return Promise.reject({
        status: "Unable to process due to unexpected error",
        error: "Error at Api call",
      });
    }
  }
};
