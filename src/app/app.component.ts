import { HttpClient } from '@angular/common/http';
import { Component} from '@angular/core';
import { ConfigService } from './services/config.service';
import { Animals } from './models/config.model';

import hexRgb from 'hex-rgb';
import rgbHex from 'rgb-hex';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  

  animals: Animals | undefined;
  selectedChart: any = "";
  color: string = '#2889e9'


  constructor(private http: HttpClient, private configService: ConfigService) { 
    // this.MyDOMElement.nativeElement.value = "#FFFFFF";
  }

  
  getData() {
    this.configService.getConfig()
      .subscribe((data: Animals) => {
        this.animals = data;
        this.configService.setApiValue(data);
        console.log(typeof(this.animals));
    });
  }

  render(){

  }

  onChange(newValue:Event) {
    this.selectedChart = newValue;        
  }

  onChangeColor(newColor:Event){
    this.configService.setColorScheme(newColor);
    let tempSelect = this.selectedChart;
    this.selectedChart = 'loading'; 
    setTimeout(()=>{this.selectedChart = tempSelect;},500);
  }

}


