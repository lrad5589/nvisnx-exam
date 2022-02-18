import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Animals } from '../models/config.model';

import hexRgb from 'hex-rgb';
import rgbHex from 'rgb-hex';

@Injectable()
export class ConfigService {

    apiUrl = "https://my-json-server.typicode.com/lrad5589/nvisnx/animals";
    apiValues:Animals = [];
    colorScheme:any = '';

    constructor(private http: HttpClient) { }

    getConfig() {
        // now returns an Observable of Config

        const options = {
            responseType: 'json' as const,
          };

        return this.http.get<Animals>(this.apiUrl,options);
    }

    public setColorScheme(color:any){
        this.colorScheme = color;
    }

    public getColorScheme(){
        return this.colorScheme;
    }

    public setApiValue(values:Animals){
        this.apiValues = values;
    }

    public getApiValue(){
        return this.apiValues;
    }

    public getNearestColorVal(){
        let selectedColor = this.getColorScheme();
        let arraySize = this.getApiValue().length;
        let nearestColorVal = []; 
        //just getting the hue of the selected color
        console.log("selected color: ",selectedColor)
        let selectedColorHexRgb = hexRgb(this.colorScheme);
        let travR = selectedColorHexRgb.red;
        let travG = selectedColorHexRgb.green;
        let travB = selectedColorHexRgb.blue;

        let middleIndex = Math.round(arraySize / 2);
        if(arraySize%2 == 0){
        middleIndex = arraySize / 2;
        }    

        nearestColorVal[middleIndex-1] = selectedColor;
        for(let travCtr=middleIndex-2; travCtr>=0; travCtr--){
        let tempR = travR;
        let tempG = travG;
        let tempB = travB;
        if(tempG+15 > 255){
            if(tempB-15 < 0){
            tempR -= 15;
            }
            else {
            tempB -= 15;
            }
        }
        else {
            tempG += 15;
        }
        travR = tempR;
        travG = tempG;
        travB = tempB;
        nearestColorVal[travCtr] = '#'+rgbHex(travR,travG,travB);
        }

        travR = selectedColorHexRgb.red;
        travG = selectedColorHexRgb.green;
        travB = selectedColorHexRgb.blue;

        for(let travCtr=middleIndex; travCtr<arraySize; travCtr++){
        let tempR = travR;
        let tempG = travG;
        let tempB = travB;
        if(tempG-15 < 0){
            if(tempB+15 > 255){
            tempR += 15;
            }
            else {
            tempB += 15;
            }
        }
        else {
            tempG -= 15;
        }
        travR = tempR;
        travG = tempG;
        travB = tempB;
        nearestColorVal[travCtr] = '#'+rgbHex(travR,travG,travB);
        }    
        return nearestColorVal;
    }

}