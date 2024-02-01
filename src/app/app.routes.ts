import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'create-project', component: CreateProjectComponent },
    {path:'project-list',component:ProjectListComponent},
    { path: 'dashboard', component: DashboardComponent },
];

