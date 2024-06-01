import { Component, Inject, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import 'chartjs-chart-financial';
import 'chartjs-adapter-luxon';
import { ChartConfiguration } from 'chart.js';
import { AppComponent } from '../app.component';


interface CandlestickData {
  x: number | Date;
  o: number;
  h: number;
  l: number;
  c: number;
}

@Component({
  selector: 'app-candlestick-chart',
  templateUrl: './candlestick-chart.component.html',
  styleUrls: ['./candlestick-chart.component.css']
})


export class CandlestickChartComponent implements OnInit {
  
  data: ChartConfiguration<'candlestick'>['data'] | undefined;
  options: ChartConfiguration<'candlestick'>['options'];

  constructor(
    @Inject(AppComponent) private nav: AppComponent
  ) { 
    Chart.register(...registerables);
    Chart.register(
      // This registers the financial elements from chartjs-chart-financial
      require('chartjs-chart-financial').CandlestickController,
      require('chartjs-chart-financial').CandlestickElement,
      require('chartjs-chart-financial').OhlcController,
      require('chartjs-chart-financial').OhlcElement
    );
  }

  ngOnInit(): void {
    this.reload();
  }

  async reload() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    
    let candleData:any = [ { x: 0, o: 33.0, h: 33.5, l: 32.8, c: 33.2 }]
    for (var i = 1; i < 200; i++) {
      var lastPoint = candleData[i - 1];
      let randomNumber = Math.random() * 0.3 - 0.1;
      candleData.push({
        x: i,
        o: lastPoint.o + randomNumber,
        h: lastPoint.h + randomNumber,
        l: lastPoint.l + randomNumber,
        c: lastPoint.c + randomNumber
      });
    }

    if (ctx)
      new Chart(ctx, {
        type: 'candlestick',
        data: {
          datasets: [{
            label: 'Candlestick Dataset',
            data: candleData as CandlestickData[]
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom'
            },
            y: {
              beginAtZero: false
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const raw = context.raw as CandlestickData;
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  label += `open: ${raw.o}, high: ${raw.h}, low: ${raw.l}, close: ${raw.c}`;
                  return label;
                }
              }
            }
          }
        }
      });
  }

}