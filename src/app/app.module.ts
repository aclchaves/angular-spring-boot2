import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProductsModule } from './products/products.module';
import { LoginComponent } from './login/login.component';

import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { TokenInterceptorService } from '../app/auth/token-interceptor.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ProductsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [AuthService, AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
