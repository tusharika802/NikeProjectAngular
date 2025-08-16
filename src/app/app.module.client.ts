import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ProductsEffects } from './store/products/products.effects';

@NgModule({
  imports: [
    EffectsModule.forRoot([ProductsEffects])
  ]
})
export class AppClientModule { } 