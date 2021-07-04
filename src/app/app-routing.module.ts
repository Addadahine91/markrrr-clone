import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSnippetComponent } from './create-snippet/create-snippet.component';
import { CreateComponent } from './create/create.component';
import { DeleteLetterComponent } from './delete-letter/delete-letter.component';
import { DeleteSnippetComponent } from './delete-snippet/delete-snippet.component';
import { EditComponent } from './edit/edit.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeContainerComponent } from './home-container/home-container.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { LoginComponent } from './login/login.component';
import { PreviewComponent } from './preview/preview.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './services/auth-guard';

const routes: Routes = [
  { path: '', component: HomeContainerComponent },
  { path: 'create', component: CreateComponent, canActivate: [AuthGuard] },
  { path: 'create-snippet', component: CreateSnippetComponent, canActivate: [AuthGuard] },
  { path: 'edit-snippet', component: CreateSnippetComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'preview', component: PreviewComponent, canActivate: [AuthGuard] },
  { path: 'edit', component: EditComponent, canActivate: [AuthGuard] },
  { path: 'delete-letter', component: DeleteLetterComponent, canActivate: [AuthGuard] },
  { path: 'delete-snippet', component: DeleteSnippetComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

] 

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top'
    })],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule {


}