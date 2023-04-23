"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetMethod = exports.handleProcessPdf = void 0;
const fs_1 = __importDefault(require("fs"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const pdfmake_1 = __importDefault(require("pdfmake"));
const dotenv = __importStar(require("dotenv"));
const form_data_1 = __importDefault(require("form-data"));
const config_js_1 = require("./config.js");
const request_js_1 = require("../utils/request.js");
dotenv.config();
const handleProcessPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const SELECTOR = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.SELECTOR;
        const baseURI = (_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b.BASE_URI;
        const API_ENDPOINT = (_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c.API_ENDPOINT;
        const TO_MAILS = (_d = process === null || process === void 0 ? void 0 : process.env) === null || _d === void 0 ? void 0 : _d.TO_MAILS;
        if (SELECTOR && baseURI && API_ENDPOINT && TO_MAILS) {
            const browser = yield puppeteer_1.default.launch();
            const page = yield browser.newPage();
            yield page.goto(baseURI);
            /* istanbul ignore next */
            const data = yield page.evaluate((baseURI, SELECTOR) => {
                let result = [];
                const elements = document.querySelectorAll(SELECTOR);
                for (const element of elements) {
                    const title = element.innerText;
                    const href = `${baseURI}${element === null || element === void 0 ? void 0 : element.getAttribute("href")}`;
                    result.push({
                        title,
                        href,
                    });
                }
                return result;
            }, baseURI, SELECTOR);
            yield browser.close();
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
                fonts: config_js_1.fonts,
            };
            const printer = new pdfmake_1.default(config_js_1.fonts);
            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            pdfDoc.pipe(fs_1.default.createWriteStream("LatestArticles.pdf").on("error", (err) => {
                console.log("err", err);
            }));
            pdfDoc.end();
            let reqObj = new form_data_1.default();
            reqObj.append("attachment", fs_1.default.createReadStream("./LatestArticles.pdf"));
            reqObj.append("toMails", TO_MAILS);
            reqObj.append("subject", `From the latest articles of ${baseURI}`);
            reqObj.append("body", `Hi please find the attatchment from  ${baseURI} latest articles.`);
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
                (0, request_js_1.request)(config)
                    .then((data) => res.json(data))
                    .catch(({ response }) => {
                    const { data } = response;
                    res.json(data.error);
                });
            }
            else {
                res.send("Endpoint is not configured");
            }
        }
        else {
            res.json("Failed to process due to missing env variable");
        }
    }
    catch (err) {
        console.log("Error", err);
        res.json(err);
    }
});
exports.handleProcessPdf = handleProcessPdf;
const handleGetMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Hi Successfully reached get");
});
exports.handleGetMethod = handleGetMethod;
