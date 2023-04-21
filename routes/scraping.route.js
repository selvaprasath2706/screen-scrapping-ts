"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../handlers/index"));
const router = express_1.default.Router();
router.route("/get").get(index_1.default.handleGetMethod);
router.route("/").get(index_1.default.handleProcessPdf);
exports.default = router;
