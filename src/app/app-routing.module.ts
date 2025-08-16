import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenComponent } from './men/men.component';
import { ProductdetailComponent } from './productdetail/productdetail.component';

const routes: Routes = [
  { path: 'new&featured', component: HomeComponent },
  { path: 'men', component: MenComponent },
  { path: '', redirectTo: '/new&featured', pathMatch: 'full' },
    { path: 'product/:id', component: ProductdetailComponent }, // 👈 detail route

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
