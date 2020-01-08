import { ProductFormComponent } from './product-form/product-form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductsComponent } from './products.component';
import { AuthGuard } from '../auth/auth.guard';
import { ProductGuard } from '../auth/product.guard';

const productRoutes: Routes = [
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuard],
    canActivateChild: [ProductGuard],
    },
  {
    path: 'products/new',
    component: ProductFormComponent,
    canActivate: [AuthGuard],
    canActivateChild: [ProductGuard],
  },
  {
    path: 'products/edit/:id',
    component: ProductFormComponent,
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(productRoutes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
