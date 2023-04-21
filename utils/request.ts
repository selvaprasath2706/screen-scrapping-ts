import axios from "axios";
import {
  SuccessfulResponse,
  FailureResponse,
  requestConfig,
} from "../Schemas.js";

export const request = async (config: requestConfig) => {
  const response = await axios.request(config);
  if (response.status === 200) {
    const data: SuccessfulResponse = response?.data;
    return data;
  } else {
    const data: FailureResponse = response?.data;
    return Promise.reject(data);
  }
};
