import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CreateService } from '../create-project/create.service';
import Chart from 'chart.js/auto';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,RouterOutlet,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
  
})
export class DashboardComponent implements OnInit {
  totalProjectCount: number = 0;
  closedCount: number = 0;
  runningCount: number = 0;
  closureDelayCount: number = 0;
  cancelledCount: number = 0;

  public chart: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private createService: CreateService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.createService.getTotalCount().subscribe(count => {
      this.totalProjectCount = count;
    });

    this.createService.getClosedCount().subscribe(count => {
      this.closedCount = count;
    });

    this.createService.getRunningCount().subscribe(count => {
      this.runningCount = count;
    });
    
    this.createService.getClosureDelayCount().subscribe(count => {
      this.closureDelayCount = count;
    });
  

    this.createService.getCancelledCount().subscribe(count => {
      this.cancelledCount = count;
    });
    this.createChart();
  }
  
  

  createChart() {
    const departments = ['Strategy', 'Fianance', 'Quality', 'Maintenance', 'Stores'];
     // Update the chart with total counts for each department
     departments.forEach((department, index) => {
      this.createService.getTotalCountByDepartment(department).subscribe(totalCount => {
        this.chart.data.datasets[0].data[index] = totalCount;
        this.chart.update();
      });
    });
  
    // Update the chart with closed counts for each department
    departments.forEach((department, index) => {
      this.createService.getClosedCountByDepartment(department).subscribe(closedCount => {
        this.chart.data.datasets[1].data[index] = closedCount;
        this.chart.update();
      });
    });
  
    // Destroy the previous chart instance if it exists
    if (this.chart) {
      this.chart.destroy();
    }
  
    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: departments,
        datasets: [
          {
            label: "Total",
            data: [],
            backgroundColor: 'blue',
            
          },
          {
            label: "Closed",
            data: [],
            backgroundColor: 'limegreen',
           
          }
        ]
      },
      options: {
        aspectRatio: 2.2
      }
      
    });
    departments.forEach((department, index) => {
      this.createService.getTotalCountByDepartment(department).subscribe(totalCount => {
        this.createService.getClosedCountByDepartment(department).subscribe(closedCount => {
          const percentage = totalCount !== 0 ? (closedCount * 100 / totalCount).toFixed(2) + "%" : "0%";
          this.chart.data.labels[index] = `${department}\n(${percentage})`;
          this.chart.data.datasets[0].data[index] = totalCount;
          this.chart.data.datasets[1].data[index] = closedCount;
          this.chart.update();
        });
      });
    });
    
  
   
  }
  

  
  

  public logout(): void{
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
