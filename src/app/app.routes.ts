import { PATHS } from "./globals/routes";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { ListingsPageComponent } from "./pages/listings-page/listings-page.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { ProfilePageComponent } from "./pages/profile-page/profile-page.component";
import { ProjectsPageComponent } from "./pages/projects-page/projects-page.component";
import { RegisterPageComponent } from "./pages/register-page/register-page.component";
import { RouterModule, Routes } from "@angular/router";


export const routes: Routes = [
    { path: '', 'title':'Home',redirectTo: PATHS.HOME, pathMatch: 'full' },
    { path: PATHS.HOME,'title':'Home', component: HomePageComponent },
    { path: PATHS.LISTINGS,'title':'Listings', component: ListingsPageComponent },
    { path: PATHS.PROFILE,'title':'Profile', component: ProfilePageComponent },
    { path: PATHS.PROJECTS,'title':'Projects', component: ProjectsPageComponent },
    { path: PATHS.REGISTER,'title':'Register', component: RegisterPageComponent },
    { path: PATHS.LOGIN, component: LoginPageComponent },
    { path: '**', redirectTo: PATHS.NOT_FOUND } 
  ];
