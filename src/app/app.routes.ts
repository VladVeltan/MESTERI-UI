import { PATHS } from "./globals/routes";
import { authGuard } from "./guards/auth.guard";
import { notAuthGuard } from "./guards/not-auth.guard";
import { userGuard } from "./guards/user.guard";
import { CreatePostPageComponent } from "./pages/create-post-page/create-post-page.component";
import { HandymanPageComponent } from "./pages/handyman-page/handyman-page.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { ListingsPageComponent } from "./pages/listings-page/listings-page.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { ProfilePageComponent } from "./pages/profile-page/profile-page.component";
import { ProjectsPageComponent } from "./pages/projects-page/projects-page.component";
import { RegisterPageComponent } from "./pages/register-page/register-page.component";
import { Routes } from "@angular/router";


export const routes: Routes = [
    { path: PATHS.HOME,'title':'Acasa',component: HomePageComponent },
    { path: PATHS.LOGIN,'title':'Autentificare',canActivate:[notAuthGuard], component: LoginPageComponent },
    { path: PATHS.LISTINGS,'title':'Anunturi', component: ListingsPageComponent },
    { path: PATHS.PROFILE,'title':'Profil', component: ProfilePageComponent },
    { path: PATHS.HANDYMAN,'title':'Mesteri', component: HandymanPageComponent },
    { path: 'profile/:email', component: ProfilePageComponent },
    // { path: PATHS.PROFILE,'title':'Profile',canActivate:[authGuard,userGuard], component: ProfilePageComponent },
    { path: PATHS.PROJECTS,'title':'Proiecte', component: ProjectsPageComponent },
    { path: PATHS.POST,'title':'Creeaza postare', component: CreatePostPageComponent },
    { path: PATHS.REGISTER,'title':'Inregistrare', component: RegisterPageComponent },
    { path: '', 'title':'Login',redirectTo: PATHS.LOGIN, pathMatch: 'full' },
    { path: '**', redirectTo: PATHS.HOME } 
  ];
