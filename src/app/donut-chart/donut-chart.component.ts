import { ArrayType } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import * as d3 from 'd3-selection';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnInit {

  pie: any;

  private margin = { top: 0, right: 30, bottom: 0, left: 40 };
  private width = 150;
  private height = 150;
  private svg: any;
  private colors: any;
  private radius = Math.min(this.width, this.height) / 2 - this.margin.left;
  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.createSvg();
    this.createColors();
    this.drawChart();
  }

  private createSvg(): void {
    this.svg = d3
      .select("figure#donut")
      .append("svg")
      .attr("viewBox", `0 0 150 150`)
      .append("g")
      .attr(
        "transform",
        "translate(" + 78 + "," + 20 + ")"
      );
  }

  private createColors(): void {
    this.colors = d3Scale
      .scaleOrdinal()
      .range(this.configService.getNearestColorVal());
  }

  private drawChart(): void {
    let arraySize = this.configService.getApiValue().length;
    // Compute the position of each group on the pie:
 
      
      this.pie = d3Shape.pie()
      .sort(null)
      .value((d: any) => 100 / arraySize);

    // The arc generator
    var arc = d3Shape
      .arc()
      .innerRadius(this.radius * 0.2) // This is the size of the donut hole
      .outerRadius(this.radius * 0.4);

    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = d3Shape
      .arc()
      .innerRadius(this.radius * 0.5)
      .outerRadius(this.radius * 0.5);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    this.svg
      .selectAll("allSlices")
      .data(this.pie(this.configService.getApiValue()))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d:any) => this.colors(d.data.title))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    // Add the polylines between chart and labels:
    this.svg
      .selectAll("allPolylines")
      .data(this.pie(this.configService.getApiValue()))
      .enter()
      .append("polyline")
      .attr("stroke", "gray")
      .style("fill", "none")
      .attr("stroke-width", 0.1)
      .attr("points", (d:any) => {
        var posA = arc.centroid(d); // line insertion in the slice
        var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
        var posC = outerArc.centroid(d); // Label position = almost the same as posB
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = this.radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC];
      });

    // Add the polylines between chart and labels:
    this.svg
      .selectAll("allLabels")
      .data(this.pie(this.configService.getApiValue()))
      .enter()
      .append("text")
      .text((d:any) => {
        return d.data.title;
      })
      .attr("font-size", "2")
      .attr("transform", (d:any) => {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = this.radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      })
      .style("text-anchor", (d:any) => {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? "start" : "end";
      });
  }

}
