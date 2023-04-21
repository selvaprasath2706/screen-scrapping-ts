import express from "express";
import fs from "fs";
import puppeteer from "puppeteer";
import pdfMake from "pdfmake";
import * as dotenv from "dotenv";
import FormData from "form-data";
import { fonts } from "./config.js";
import { FailureResponse, PdfResult, SuccessfulResponse } from "../Schemas.js";
import { request } from "../utils/request.js";
import { AxiosResponse } from "axios";
dotenv.config();
export const handleProcessPdf = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const SELECTOR = process?.env?.SELECTOR;
    const baseURI = process?.env?.BASE_URI;
    const API_ENDPOINT = process?.env?.API_ENDPOINT;
    const TO_MAILS = process?.env?.TO_MAILS;
    if (SELECTOR && baseURI && API_ENDPOINT && TO_MAILS) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(baseURI);
      const data: PdfResult[] = await page.evaluate(
        (baseURI, SELECTOR) => {
          let result: PdfResult[] = [];
          const elements =
            document.querySelectorAll<HTMLInputElement>(SELECTOR);
          for (const element of elements) {
            const title = element.innerText;
            const href = `${baseURI}${element?.getAttribute("href")}`;
            result.push({
              title,
              href,
            });
          }
          return result;
        },
        baseURI,
        SELECTOR
      );

      await browser.close();
      const docDefinition = {
        content: [
          { text: `The data from ${baseURI} is`, fontSize: 16 },
          data.map((indvidualData) => {
            return [
              {
                text: indvidualData.title,
                link: indvidualData.href,
                color: "blue",
              },
            ];
          }),
        ],
        fonts,
      };

      const printer = new pdfMake(fonts);
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(
        fs.createWriteStream("LatestArticles.pdf").on("error", (err) => {
          console.log("err", err);
        })
      );
      pdfDoc.end();
      let reqObj = new FormData();
      reqObj.append("attachment", fs.createReadStream("./LatestArticles.pdf"));
      reqObj.append("toMails", TO_MAILS);
      reqObj.append("subject", `From the latest articles of ${baseURI}`);
      reqObj.append(
        "body",
        `Hi please find the attatchment from  ${baseURI} latest articles.`
      );
      if (process.env.API_ENDPOINT) {
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: process.env.API_ENDPOINT,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: reqObj,
        };
        request(config)
          .then((data: SuccessfulResponse) => res.json(data))
          .catch(({ response }: { response: AxiosResponse }) => {
            const { data }: { data: FailureResponse } = response;
            res.json(data.error);
          });
      } else {
        res.send("Endpoint is not configured");
      }
    } else {
      res.json("Failed to process due to missing env variable");
    }
  } catch (err) {
    console.log("Error", err);
    res.json(err);
  }
};

export const handleGetMethod = async (
  req: express.Request,
  res: express.Response
) => {
  res.send("Hi Successfully reached get");
};
