import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../product';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { loadProducts, selectAllProducts, selectProductsError, selectProductsLoading } from '../store';

@Component({
  selector: 'app-men',
  templateUrl: './men.component.html',
  styleUrls: ['./men.component.scss']
})
export class MenComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading$!: Observable<boolean>;
  error$!: Observable<any>;
  products$!: Observable<Product[]>;
  private productsSubscription?: Subscription;

  // Filter states
  selectedCategories: string[] = [];
  selectedPriceRanges: string[] = [];
  selectedSizes: string[] = [];
  selectedColors: string[] = [];
  showOnSale = false;
  showNewArrivals = false;

  // Available filter options
  categories = ['Training & Gym', 'Running', 'Basketball'];
  priceRanges = ['Under $50', '$50 - $100', '$100 - $150', 'Over $150'];
  sizes = ['7', '8', '9', '10', '11', '12'];
  colors = ['Black', 'White', 'Red', 'Blue'];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadProducts());
    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.error$ = this.store.select(selectProductsError);

    this.productsSubscription = this.products$.subscribe((products) => {
      this.products = products;
      this.filteredProducts = [...this.products];
    });
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  // Filter methods
  toggleCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
    this.applyFilters();
  }

  togglePriceRange(range: string): void {
    const index = this.selectedPriceRanges.indexOf(range);
    if (index > -1) {
      this.selectedPriceRanges.splice(index, 1);
    } else {
      this.selectedPriceRanges.push(range);
    }
    this.applyFilters();
  }

  toggleSize(size: string): void {
    const index = this.selectedSizes.indexOf(size);
    if (index > -1) {
      this.selectedSizes.splice(index, 1);
    } else {
      this.selectedSizes.push(size);
    }
    this.applyFilters();
  }

  toggleColor(color: string): void {
    const index = this.selectedColors.indexOf(color);
    if (index > -1) {
      this.selectedColors.splice(index, 1);
    } else {
      this.selectedColors.push(color);
    }
    this.applyFilters();
  }

  toggleOnSale(): void {
    this.showOnSale = !this.showOnSale;
    this.applyFilters();
  }

  toggleNewArrivals(): void {
    this.showNewArrivals = !this.showNewArrivals;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      // Category filter
      if (this.selectedCategories.length > 0) {
        const hasCategory = this.selectedCategories.some(category => 
          product.description.toLowerCase().includes(category.toLowerCase())
        );
        if (!hasCategory) return false;
      }

      // Price range filter
      if (this.selectedPriceRanges.length > 0) {
        const inPriceRange = this.selectedPriceRanges.some(range => {
          if (range === 'Under $50') return product.price < 50;
          if (range === '$50 - $100') return product.price >= 50 && product.price <= 100;
          if (range === '$100 - $150') return product.price >= 100 && product.price <= 150;
          if (range === 'Over $150') return product.price > 150;
          return false;
        });
        if (!inPriceRange) return false;
      }

      // On sale filter (mock - products with price < 130)
      if (this.showOnSale && product.price >= 130) return false;

      // New arrivals filter (mock - first 3 products)
      if (this.showNewArrivals && product.id > 3) return false;

      return true;
    });
  }

  clearAllFilters(): void {
    this.selectedCategories = [];
    this.selectedPriceRanges = [];
    this.selectedSizes = [];
    this.selectedColors = [];
    this.showOnSale = false;
    this.showNewArrivals = false;
    this.filteredProducts = [...this.products];
  }

  getColorValue(color: string): string {
    const colorMap: { [key: string]: string } = {
      'Black': '#000000',
      'White': '#FFFFFF',
      'Red': '#EF4444',
      'Blue': '#3B82F6'
    };
    return colorMap[color] || '#000000';
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      // Create a better fallback image with product info
      const productName = target.alt || 'Product';
      const fallbackSvg = this.createFallbackImage(productName);
      target.src = fallbackSvg;
    }
  }

  onImageLoad(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      console.log('Image loaded successfully:', target.src);
    }
  }

  createFallbackImage(productName: string): string {
    // Create a simple SVG placeholder with the product name
    const svg = `
      <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="#F3F4F6"/>
        <circle cx="150" cy="80" r="30" fill="#D1D5DB"/>
        <rect x="100" y="120" width="100" height="60" rx="8" fill="#D1D5DB"/>
        <text x="150" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6B7280">${productName}</text>
      </svg>
    `;
    return 'data:image/svg+xml;base64,' + btoa(svg);
  }
} 