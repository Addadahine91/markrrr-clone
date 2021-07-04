import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CreateComponent } from './create/create.component';
import { PreviewComponent } from './preview/preview.component';
import { CreateSnippetComponent } from './create-snippet/create-snippet.component';
import { ListComponent } from './list/list.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule }   from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { DeleteLetterComponent } from './delete-letter/delete-letter.component';
import { DeleteSnippetComponent } from './delete-snippet/delete-snippet.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeContainerComponent } from './home-container/home-container.component';
import { AuthInterceptor } from './services/auth-interceptor';
import { IdDatePipe } from './id-date.pipe';
import { AuthGuard } from './services/auth-guard';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ForgotPasswordComponent,
    CreateComponent,
    PreviewComponent,
    CreateSnippetComponent,
    ListComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    EditComponent,
    DeleteLetterComponent,
    DeleteSnippetComponent,
    ProfileComponent,
    HomeContainerComponent,
    IdDatePipe
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatExpansionModule,
    AppRoutingModule,
    NgbModule,
    MatMenuModule,
    ReactiveFormsModule,
    AngularEditorModule,
    HttpClientModule,
    MatSnackBarModule
  ],
  providers: [
    AuthGuard,
    RouterModule,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
