"use strict";
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
exports.request = void 0;
const axios_1 = __importDefault(require("axios"));
const request = (config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const response = yield axios_1.default.request(config);
        if (response.status === 200) {
            const data = response === null || response === void 0 ? void 0 : response.data;
            return data;
        }
        else {
            const data = response === null || response === void 0 ? void 0 : response.data;
            return Promise.reject(data);
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) {
                const data = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data;
                return Promise.reject(data);
            }
            else {
                return Promise.reject({ error: error.message });
            }
        }
        else {
            return Promise.reject({
                status: "Unable to process due to unexpected error",
                error: "Error at Api call",
            });
        }
    }
});
exports.request = request;
