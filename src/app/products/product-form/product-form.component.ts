import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ProductsService } from './../products.service';
import { Product } from '../../dto/product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  prodName: String = '';
  prodDescription: String = '';
  prodPrice: number;
  prodImgUrl: String = '';

  editProd: Product = null;

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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

  }

  saveProduct() {
    if (this.productForm.valid) {
      this.service.insert({name: this.prodName,
           description: this.prodDescription,
           price: this.prodPrice,
           imgUrl: this.prodImgUrl})
         .subscribe((product) => {
          window.alert('Product was insert with success.');           
           this.router.navigate(['/products']);
         })       
    }
 }

  updateForm(product) {
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price
    });
  }

  hasError(field: string) {
    return this.productForm.get(field).errors;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.productForm.value);
    if (this.productForm.valid) {
      console.log('submit');
      this.service.insert(this.productForm.value).subscribe(
        success => {
          console.log('success');
          window.alert('Product was insert with success.');
          this.router.navigate(['/products']); // Volta para a rota anterior
        },
        error => {
          console.log('error');
          window.alert('Error, product wasnt insert');
        },
        () => console.log('request completo')
      );
    }

  }

  onCancel() {
    this.submitted = false;
    this.productForm.reset();
  }

}

