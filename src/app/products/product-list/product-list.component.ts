import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProductsService } from './../products.service';
import { Product } from '../../dto/product';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  nameProd: String = '';
  products: Product[];
 

  private unsubscribe$: Subject<Product[]> = new Subject();

  constructor(
    private service: ProductsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.findAll();
  }

  findAll() {
    this.service.findAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((prod) => {
        this.products = prod['content'];
      }, (error) => {
        if(error instanceof HttpErrorResponse) {
          if(error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      } );

  } 

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

}
