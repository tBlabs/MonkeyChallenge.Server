#!/usr/bin/env node
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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config(); // Loads variables from '.env' file to process.env
const IoC_1 = require("./IoC/IoC");
const Main_1 = require("./Main");
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const main = IoC_1.IoC.get(Main_1.Main);
        yield main.Start();
    }
    catch (ex) {
        console.log('Startup exception:', ex);
    }
}))();
//# sourceMappingURL=startup.js.map