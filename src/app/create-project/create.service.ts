import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
  
})
export class CreateService {

  private url = "http://localhost:3000/projectDetails";

  
  private projectList: any[] = [];
  
  constructor(private http: HttpClient) { }

  public addProject(project:any):Observable<any>{
    return this.http.post<any>(this.url,project).pipe(
      catchError(this.errorHandler)
    );
  }


 

  public getProjectById(id: number): Observable<any> {
    const localProject = this.projectList.find(project => project.id === id);
    
    if (localProject) {
      return new Observable(observer => {
        observer.next(localProject);
        observer.complete();
      });
    } else {
      const projectByIdUrl = `${this.url}/${id}`;
      return this.http.get<any>(projectByIdUrl);
    }
  }
  public getProjectList(): Observable<any[]> {
    return this.http.get<any[]>(this.url).pipe(
      tap(projects => {
        this.projectList = projects;
      }),
      catchError(this.errorHandler)
    );
  }


  public getProjectDetailsById(id: number): Observable<any> {
  const projectDetailsUrl = `${this.url}/${id}`;
  return this.http.get<any>(projectDetailsUrl).pipe(
    catchError(error => {
      console.error('Error fetching project details:', error);
      return throwError(error);
    })
  );
}

updateStatus(project: any): Observable<any> {
  const updateUrl = `${this.url}/${project.id}`;
  return this.http.put<any>(updateUrl, project).pipe(
    catchError(this.errorHandler)
  );
}

getStatusCountByStatus(status: string): Observable<number> {
  return this.http.get<any[]>(this.url).pipe(
    map(projects => projects.filter(project => project.status === status).length),
    catchError(this.errorHandler)
  );
}
getRunningCount(): Observable<number> {
  return this.getStatusCountByStatus('Running');
}

getCancelledCount(): Observable<number> {
  return this.getStatusCountByStatus('Cancelled');
}

getClosedCount(): Observable<number> {
  return this.getStatusCountByStatus('Closed');
}

getTotalCount(): Observable<number> {
  return this.http.get<any[]>(this.url).pipe(
    map(projects => projects.length),
    catchError(this.errorHandler)
  );
}
getClosureDelayCount(): Observable<number> {
  const today = new Date();
  // console.log('Today:', today);
  return this.http.get<any[]>(this.url).pipe(
    map(projects => projects.filter(project => project.status === 'Running' && new Date(project.enddate) < today).length),
    catchError(this.errorHandler)
  );
}


getStatusCountByStatusAndDepartment(status: string, department: string): Observable<number> {
  return this.http.get<any[]>(this.url).pipe(
    map(projects => projects.filter(project => project.status === status && project.department === department).length),
    catchError(this.errorHandler)
  );
}

getTotalCountByDepartment(department: string): Observable<number> {
  return this.http.get<any[]>(this.url).pipe(
    map(projects => projects.filter(project => project.department === department).length),
    catchError(this.errorHandler)
  );
}

getClosedCountByDepartment(department: string): Observable<number> {
  return this.getStatusCountByStatusAndDepartment('Closed', department);
}



  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = 'Error Code: ${error.status}\nMessage: ${error.message}';
    }
    console.log(errorMessage);
    return throwError(() => new Error(errorMessage));


  }

}
