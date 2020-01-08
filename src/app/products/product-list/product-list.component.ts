import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProductsService } from './../products.service';
import { Product } from '../../dto/product';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
//import { DialogProductComponent } from '../dialog-product/dialog-product.component';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  prodName: String = '';
  prodDescription: String = '';
  prodPrice: number;
  prodImgUrl: String = '';
  products: Product[];

  prodEdit: Product = null;
  
  products$: Observable<Product[]>; 

  private unsubscribe$: Subject<Product[]> = new Subject();

  constructor(
    private service: ProductsService,
    private router: Router,
    private authService: AuthService
    //public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.findAll();
    this.onRefresh();
  }

  onRefresh() {
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
  
  editProduct(prod: Product) {
    this.prodName = Object.values(prod)[1];
    this.prodDescription = Object.values(prod)[2];
    this.prodPrice = Object.values(prod)[3];
    this.prodImgUrl = '';
    this.prodEdit = prod;

    

    /*const dialogRef; = this.dialog.open(DialogProductComponent, {
      data: {name: this.prodName,
          description: this.prodDescription,
          price: this.prodPrice,
          imgUrl: this.prodImgUrl}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      this.service.update({name: result.name,
            description: result.description,
            price: result.price,
            imgUrl: '',
            id: Object.values(prod)[0]}).subscribe(
        (success) => {
          
          //this.notify('Produto alterado com sucesso'),
          this.onRefresh()
        },
        (err) => console.log(err)
      )});*/
  }

  deleteProduct(prod: Product) {
   let id = Object.values(prod)[0];
    console.log(id)
    this.service.remove(id)
      .subscribe(
        (success) => {
          //this.notify('Produto removido'),
          this.onRefresh()
        },
        (err) => console.log(err)
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

}
