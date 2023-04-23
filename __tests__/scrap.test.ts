//  export NODE_TLS_REJECT_UNAUTHORIZED=0
import request from "supertest";
import app from "../index";
import FormData from "form-data";
import fs from "fs";
import * as dotenv from "dotenv";
import { request as UtilsRequest } from "../utils/request";

dotenv.config();

describe("Testing Web scraping", () => {
  test("For get route", async () => {
    const res = await request(app).get("/get");
    expect(res.text).toEqual("Hi Successfully reached get");
  });

  test("For generation of pdf route", async () => {
    const res = await request(app).get("/");
    expect(res.body).toEqual({
      status: "Bulk Mail Send...!",
    });
  }, 10000);

  test("For generation of pdf route when endpoint is configure in env", async () => {
    if (process?.env?.API_ENDPOINT) {
      const reqObj = new FormData();
      reqObj.append("attachment", fs.createReadStream("./LatestArticles.pdf"));
      reqObj.append("toMails", process.env.TO_MAILS);
      reqObj.append(
        "subject",
        `From the latest articles of ${process.env.BASE_URI}`
      );
      reqObj.append(
        "body",
        `Hi please find the attatchment from  ${process.env.BASE_URI} latest articles.`
      );
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: process?.env?.API_ENDPOINT,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: reqObj,
      };
      const res = await UtilsRequest(config);
      expect(res).toEqual({
        status: "Bulk Mail Send...!",
      });
    }
  }, 10000);

  test("For generation of pdf route when backend endpoint is not configured in env", async () => {
    try {
      const reqObj = new FormData();
      reqObj.append("attachment", fs.createReadStream("./LatestArticles.pdf"));
      reqObj.append("toMails", process.env.TO_MAILS);
      reqObj.append(
        "subject",
        `From the latest articles of ${process.env.BASE_URI}`
      );
      reqObj.append(
        "body",
        `Hi please find the attatchment from  ${process.env.BASE_URI} latest articles.`
      );
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: reqObj,
      };
      const res = await UtilsRequest(config);
      expect(res).toEqual({
        status: "Bulk Mail Send...!",
      });
    } catch (er) {
      expect(er).toEqual({
        error: "connect ECONNREFUSED 127.0.0.1:80",
      });
    }
  }, 10000);

  test("For failure case of pdf route for an invalid email", async () => {
    if (process?.env?.API_ENDPOINT) {
      const reqObj = new FormData();
      reqObj.append("attachment", fs.createReadStream("./LatestArticles.pdf"));
      reqObj.append("toMails", "sam@mple@gmail.com");
      reqObj.append(
        "subject",
        `From the latest articles of ${process.env.BASE_URI}`
      );
      reqObj.append(
        "body",
        `Hi please find the attatchment from  ${process.env.BASE_URI} latest articles.`
      );
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: process?.env?.API_ENDPOINT,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: reqObj,
      };
      try {
        const res = await UtilsRequest(config);
      } catch (er) {
        expect(er).toEqual({
          status: "Mail Send Failed",
          error: "Given mail addresses are invalid",
        });
      }
    }
  }, 10000);
  test("For failure case of pdf route for an invalid email", async () => {
    if (process?.env?.API_ENDPOINT) {
      const reqObj = new FormData();
      reqObj.append("attachment", fs.createReadStream("./LatestArticles.pdf"));
      reqObj.append("toMails", "sam@mple@gmail.com");
      reqObj.append(
        "subject",
        `From the latest articles of ${process.env.BASE_URI}`
      );
      reqObj.append(
        "body",
        `Hi please find the attatchment from  ${process.env.BASE_URI} latest articles.`
      );
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: process?.env?.API_ENDPOINT,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: reqObj,
      };
      try {
        const res = await UtilsRequest(config);
      } catch (er) {
        expect(er).toEqual({
          status: "Mail Send Failed",
          error: "Given mail addresses are invalid",
        });
      }
    }
  }, 10000);
});
