import { CommonModule} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CreateService } from './create.service';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,RouterOutlet,RouterModule],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent implements OnInit {
  

  createForm!: FormGroup;
  isUpdatebtn: boolean = false;
  queryValue: string | null = null;

  reasonList=["Business","Dealership","Transport"];
  typeList=["Internal","External","Vendor"];
  divisionList=["Compressor","Filters","Pumps","Glass","Water Heater"];
  categoryList=["Quality A","Quality B","Quality C","Quality D"];
  priorityList=["High","Medium","Low"];
  departmentList=["Strategy","Fianance","Quality","Maintenance","Stores"];
  locationList=["Pune","Mumbai","Delhi","Nashik"];


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private createService: CreateService
  ) {}

  projectList:any=[];

  ngOnInit(): void {
    this.createForm = this.fb.group({
      projectName:[,Validators.required],
      reason:[,Validators.required],
      type:[,Validators.required],
      division:[,Validators.required],
      category:[,Validators.required],
      priority:[,Validators.required],
      department:[,Validators.required],
      startdate:[,Validators.required],
      enddate:[,Validators.required],
      location:[,Validators.required],
      status:["New"]
    });

  }
  get projectName() {
    return this.createForm.get('projectName');
  }

  get reason() {
    return this.createForm.get('reason');
  }
  get type() {
    return this.createForm.get('type');
  }
  get division() {
    return this.createForm.get('division');
  }
  get category() {
    return this.createForm.get('category');
  }
  get priority() {
    return this.createForm.get('priority');
  }
  get department() {
    return this.createForm.get('department');
  }
  get startdate() {
    return this.createForm.get('startdate');
  }
  get enddate() {
    return this.createForm.get('enddate');
  }
  get location() {
    return this.createForm.get('location');
  }
  get status() {
    return this.createForm.get('status');
  }
  saveProject(){
    let project=this.createForm.value;
    this.createService.addProject(project).subscribe(result=>{});
    this.createForm.reset();
  }

  public logout(): void{
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
