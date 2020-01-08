import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProductsService } from './../products.service';
import { Product } from '../../dto/product';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
//import { DialogProductComponent } from '../dialog-product/dialog-product.component';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  prodId: number;
  prodName: String = '';
  prodDescription: String = '';
  prodPrice: number;
  prodImgUrl: String = '';
  products: Product[];

  prodEdit: Product = null;
  
  products$: Observable<Product[]>; 

  private unsubscribe$: Subject<Product[]> = new Subject();

  //modal
  title = 'ng-bootstrap-modal-demo';
  closeResult: string;
  modalOptions:NgbModalOptions;

  productForm: FormGroup =  this.fb.group({
    _id: [null],
    name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]],
    description: ['',[Validators.required, Validators.minLength(20), Validators.maxLength(254)]],
    price: 0,
    imgUrl: '',
  });

  submitted = false;

  constructor(
    private fb: FormBuilder,
    private service: ProductsService,
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal
    //public dialog: MatDialog
  ) { 
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
  }

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

  findById(prod: Product){
    this.service.findById(prod.id).pipe(takeUntil(this.unsubscribe$))
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
    this.prodId =  Object.values(prod)[0];
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

  updateForm() {
    console.log(this.productForm)
    //if (this.productForm.valid) {      
      this.service.update({
           id: this.prodId,
           name: this.prodName,
           description: this.prodDescription,
           price: this.prodPrice,
           imgUrl: this.prodImgUrl})
         .subscribe((product) => {
          window.alert('Product was update with success.');
          this.onRefresh();           
           this.router.navigate(['/products']);
         })       
    //}
  }

  deleteProduct(prod: Product) {
   let id = Object.values(prod)[0];
    console.log(id)
    this.service.remove(id)
      .subscribe(
        (success) => {
          window.alert('Product was delete with success.');
          //this.notify('Produto removido'),
          this.onRefresh()
        },
        (insuccess) =>{
          window.alert('Product has linked orders.');
          (err) => console.log(err)
        }  
        
        
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  open(content) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
 
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
