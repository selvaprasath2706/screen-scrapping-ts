"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scraping_handler_1 = require("./scraping.handler");
const scrappingHandlers = { handleProcessPdf: scraping_handler_1.handleProcessPdf, handleGetMethod: scraping_handler_1.handleGetMethod };
exports.default = scrappingHandlers;
