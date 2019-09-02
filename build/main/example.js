"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interceptor_1 = __importDefault(require("./interceptor"));
exports.request = new interceptor_1.default();
exports.response = new interceptor_1.default();
