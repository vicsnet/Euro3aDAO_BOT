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
const ethers_1 = require("ethers");
const jsbi_1 = __importDefault(require("jsbi"));
const v3_sdk_1 = require("@uniswap/v3-sdk");
const qs = require('qs');
require('dotenv').config();
const ALCHEMY_URL = process.env.POLYGON_URL;
const Ox_api = process.env.API_KEY;
const token0_usdc = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
const token1_EURO3 = '0xA0e4c84693266a9d3BBef2f394B33712c76599Ab';
const provider = new ethers_1.ethers.providers.JsonRpcProvider(ALCHEMY_URL);
const sqrtPriceX96 = '77502420832524055833179464458980877';
const liquidity = '867460364400220596';
const tick = 275883;
const tokensIn = 'EURO3_token';
const tokensOut = 'USDC_Token';
// const UNISWAP_QUOTER_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
//        const quoterContract = new ethers.Contract(
//         UNISWAP_QUOTER_ADDRESS,
//         Quoter.abi,
//         provider
//       )
//       const pool = new Pool(
//         CurrentConfig.tokens.in,
//         CurrentConfig.tokens.out,
//         500,
//        sqrtPriceX96.toString(),
//         liquidity.toString(),
//        tick
//       )
//       const swapRoute = new Route(
//         [pool],
//         CurrentConfig.tokens.in,
//         CurrentConfig.tokens.out
//       )
function main(baseToken, quoteToken, inputAmount, baseTokenDecimals, quoteTokenDecimals, amountIn) {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            try {
                const currentTick = 275852;
                const sqrtRatioX96 = v3_sdk_1.TickMath.getSqrtRatioAtTick(currentTick);
                const ratioX192 = jsbi_1.default.multiply(sqrtRatioX96, sqrtRatioX96);
                const baseAmount = jsbi_1.default.BigInt(inputAmount * (Math.pow(10, baseTokenDecimals)));
                const shift = jsbi_1.default.leftShift(jsbi_1.default.BigInt(1), jsbi_1.default.BigInt(192));
                const quoteAmount = v3_sdk_1.FullMath.mulDivRoundingUp(ratioX192, baseAmount, shift);
                console.log(quoteAmount.toString() / (Math.pow(10, quoteTokenDecimals)));
                const underPegthreshold = 1 - (0.5 / 100);
                const overPegThreshold = 1 + (1.0 / 100);
                const headers = { '0x-api-key': '108ce82c-b1c3-45d4-8d55-061f8b768fbf' };
                if (quoteAmount.toString() / (Math.pow(10, quoteTokenDecimals)) < underPegthreshold) {
                    console.log('sell');
                    // const params = {
                    //         // Not all token symbols are supported. The address of the token should be used instead.
                    //         sellToken: quoteToken,
                    //         buyToken: baseToken, 
                    //         sellAmount: amountIn,
                    //         takerAddress: '0x8DCeC3aF87Efc4B258f2BCAEB116D36B9ca012ee', 
                    //     };
                    //     const response = await fetch(
                    //         ` https://polygon.api.0x.org/swap/v1/quote?${qs.stringify(params)}`, { headers }
                    //     ); 
                    //     const quote= await response.json();
                    //     console.log(quote);
                }
                else if (quoteAmount.toString() / (Math.pow(10, quoteTokenDecimals)) > overPegThreshold) {
                    console.log('sell1');
                    // const params = {
                    //         // Not all token symbols are supported. The address of the token should be used instead.
                    //         sellToken:baseToken,
                    //         buyToken:  quoteToken, 
                    //         sellAmount: amountIn,
                    //         takerAddress: '0x8DCeC3aF87Efc4B258f2BCAEB116D36B9ca012ee', 
                    //     };
                    //     const response = await fetch(
                    //         ` https://polygon.api.0x.org/swap/v1/quote?${qs.stringify(params)}`, { headers }
                    //     ); 
                    //     const quote= await response.json();
                    //     console.log(quote);
                }
                yield sleep(300000);
            }
            catch (error) {
                console.error(error);
            }
        }
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
main(token0_usdc, token1_EURO3, 1, 6, 18, 1000).catch(error => console.error('Error in main function:', error));
