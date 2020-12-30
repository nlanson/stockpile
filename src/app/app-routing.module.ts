import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'item',
    loadChildren: () => import('./pages/item/item.module').then( m => m.ItemPageModule)
  },
  {
    path: 'new-item',
    loadChildren: () => import('./modals/new-item/new-item.module').then( m => m.NewItemPageModule)
  },
  {
    path: 'new-location',
    loadChildren: () => import('./modals/new-location/new-location.module').then( m => m.NewLocationPageModule)
  },
  {
    path: 'edit-location',
    loadChildren: () => import('./modals/edit-location/edit-location.module').then( m => m.EditLocationPageModule)
  },
  {
    path: 'edit-item',
    loadChildren: () => import('./modals/edit-item/edit-item.module').then( m => m.EditItemPageModule)
  },
  {
    path: 'edit-item-detail',
    loadChildren: () => import('./modals/edit-item-detail/edit-item-detail.module').then( m => m.EditItemDetailPageModule)
  },
  {
    path: 'settings2',
    loadChildren: () => import('./modals/settings2/settings2.module').then( m => m.Settings2PageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
