import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrl: './productdetail.component.scss'
})

export class ProductdetailComponent implements OnInit {
  product: any;
  selectedSize: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(productId).subscribe((data) => {
      this.product = data;

      // split sizes string from backend → array
      if (this.product.sizes) {
        this.product.sizesArray = this.product.sizes.split(',');
      }
    });
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  addToBag() {
    if (!this.selectedSize) {
      alert('Please select a size first');
      return;
    }
    alert(`Added ${this.product.name} (${this.selectedSize}) to Bag`);
  }
}
