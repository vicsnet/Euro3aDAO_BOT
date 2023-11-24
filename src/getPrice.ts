import { ethers } from "ethers";
import jsbi from 'jsbi';

import { TickMath, FullMath, computePoolAddress, Route, Pool } from "@uniswap/v3-sdk";
import { Token } from '@uniswap/sdk-core'
const qs = require('qs');
require('dotenv').config()


const ALCHEMY_URL = process.env.POLYGON_URL;
const Ox_api = process.env.API_KEY;

const token0_usdc='0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
const token1_EURO3='0xA0e4c84693266a9d3BBef2f394B33712c76599Ab';
const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_URL);



    

async function main(baseToken:string, quoteToken:string, inputAmount:number,  baseTokenDecimals:number, quoteTokenDecimals:number, amountIn:number){
        while (true) {
                try{

                        const currentTick=275852;
                
                     
                        const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(currentTick);
                    
                        const ratioX192 = jsbi.multiply(sqrtRatioX96, sqrtRatioX96)
                
                        const baseAmount= jsbi.BigInt(inputAmount *(10**baseTokenDecimals))
                
                        const shift = jsbi.leftShift(jsbi.BigInt(1), jsbi.BigInt(192))
                
                       const quoteAmount:any = FullMath.mulDivRoundingUp(ratioX192, baseAmount, shift);
                       console.log(quoteAmount.toString()/(10**quoteTokenDecimals));
                
                       const underPegthreshold = 1-(0.5/100);
                       const overPegThreshold = 1+(1.0/100);
                
                       
                
                const headers = {'0x-api-key':'108ce82c-b1c3-45d4-8d55-061f8b768fbf'};
                
                       if(quoteAmount.toString()/(10**quoteTokenDecimals ) < underPegthreshold){
                        console.log('sell');
                        const params = {
                                // Not all token symbols are supported. The address of the token should be used instead.
                                sellToken: quoteToken,
                                buyToken: baseToken, 
                                
                                sellAmount: amountIn,
                                takerAddress: '0x8DCeC3aF87Efc4B258f2BCAEB116D36B9ca012ee', 
                            };
                            
                        
                            const response = await fetch(
                                ` https://polygon.api.0x.org/swap/v1/quote?${qs.stringify(params)}`, { headers }
                            ); 
                            
                            const quote= await response.json();
                            console.log(quote);
                        
                       }else if(quoteAmount.toString()/(10**quoteTokenDecimals ) > overPegThreshold){
                        console.log('sell1');
                        const params = {
                                // Not all token symbols are supported. The address of the token should be used instead.
                                sellToken:baseToken,
                                buyToken:  quoteToken, 
                           
                                sellAmount: amountIn,
                                takerAddress: '0x8DCeC3aF87Efc4B258f2BCAEB116D36B9ca012ee', 
                            };
                            
                           
                            const response = await fetch(
                                ` https://polygon.api.0x.org/swap/v1/quote?${qs.stringify(params)}`, { headers }
                            ); 
                            
                            const quote= await response.json();
                            console.log(quote);
                        
                       }

                       await sleep(300000); 
                } catch(error){
                        console.error( error);
                }
        }
       
}
function sleep(ms:any) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      
main(token0_usdc,token1_EURO3,1,6,18, 1000).catch(error => console.error('Error in main function:', error))