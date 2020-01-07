import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ProductsService } from './../products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  form: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private service: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    // Tenta capiturar o id que está sendo passado
    this.route.params.subscribe(
      (params: any) => {
        const id = params['id'];
        console.log(id);
        const product$ = this.service.findById(id);
        product$.subscribe(product => {
          this.updateForm(product);
        });
      }
    );

    this.form = this.fb.group({
      id: [null], // Insere essa linha para edição do formulário
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      description: [null, Validators.maxLength(300)],
      price: [null, Validators.required]
    });
  }

  updateForm(product) {
    this.form.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price
    });
  }

  hasError(field: string) {
    return this.form.get(field).errors;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.form.value);
    if (this.form.valid) {
      console.log('submit');
      this.service.insert(this.form.value).subscribe(
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
    this.form.reset();
  }

}

