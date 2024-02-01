import { Component, OnInit } from '@angular/core';
import { CreateService } from '../create-project/create.service';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,RouterOutlet,RouterModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent  implements OnInit {
  projectList: any[]=[]; // Array to store the project list
  searchText: string = '';

  // Filtered project list based on search
  filteredProjects: any= []; 

  
  constructor(private createService: CreateService, private router: Router,private route:ActivatedRoute) {}

  ngOnInit(): void {
    
    this.fetchProjectList();

    // Subscribe to route parameter changes to dynamically load project details by ID
    this.route.params.subscribe(params => {
      const projectId = +params['id'];
      if (projectId) {
        this.loadProjectDetails(projectId);
      }
    });
  }

  fetchProjectList() {
    this.createService.getProjectList().subscribe(
      (projects) => {
        this.projectList = projects;
      this.performSearch();

      },
      (error) => {
        console.error('Error fetching project list:', error);
      }
    );
  }

  loadProjectDetails(projectId: number) {
    // Fetch project details by ID and update the projectList array
    this.createService.getProjectDetailsById(projectId).subscribe(
      (projectDetails) => {
        this.projectList = [projectDetails]; // Replace the entire projectList array with the fetched details
      },
      (error) => {
        console.error('Error fetching project details:', error);
      }
    );
  }

  updateStatus(project:any,value:number|any){
    if(value===1){
      project.status="Running";
    }
    else if(value===2){
      project.status="Closed";
    }
    else if(value===3){
      project.status="Cancelled";
    }
    this.createService.updateStatus(project).subscribe(result=>{
      this.fetchProjectList();
    })
  }
    sortTable() {
      if(this.selectedValue==="1"){
        this.projectList=this.projectList.sort((a,b)=>(a.projectName>b.projectName?1:-1));
      }
      else if(this.selectedValue==="2"){
        this.projectList=this.projectList.sort((a,b)=>(a.reason>b.reason?1:-1));
      }
      else if(this.selectedValue==="3"){
        this.projectList=this.projectList.sort((a,b)=>(a.type>b.type?1:-1));
      }
      else if(this.selectedValue==="4"){
        this.projectList=this.projectList.sort((a,b)=>(a.division>b.division?1:-1));
      }
      else if(this.selectedValue==="5"){
        this.projectList=this.projectList.sort((a,b)=>(a.category>b.category?1:-1));
      }
      else if(this.selectedValue==="6"){
        this.projectList=this.projectList.sort((a,b)=>(a.priority>b.priority?1:-1));
      }
      else if(this.selectedValue==="7"){
        this.projectList=this.projectList.sort((a,b)=>(a.department>b.department?1:-1));
      }
      else if(this.selectedValue==="8"){
        this.projectList=this.projectList.sort((a,b)=>(a.location>b.location?1:-1));
      }
   
    }
    selectedValue:string="";
    getSelectedvalue(event:any){
      this.selectedValue=event.target.value;
      this.sortTable();


    }
    // Method to perform search
performSearch(): void {
  console.log('in side perform search')
  // Convert search text to lowercase for case-insensitive search
  console.log(this.projectList)
  this.filteredProjects=[];
  const searchTerm = this.searchText.toLowerCase();
  console.log(searchTerm);

  if(searchTerm!=''){
    
    this.filteredProjects = this.projectList.filter(project =>
      // Check if the search term exists in any column
      Object.values(project).some(value =>
        value ? value.toString().toLowerCase().includes(searchTerm) : false
      )
    );
  }
 else{
  this.filteredProjects=this.projectList;
 }
  
}


  

  public logout(): void{
    localStorage.clear();
    this.router.navigate(['/']);
  }
}