import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FirebaseService } from './services/firebase.service';
import { UtilsService } from './services/utils.service';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

@NgModule({
  imports: [CommonModule],
  providers: [
    FirebaseService,
    UtilsService,
    authGuard,
    noAuthGuard,
  ]
})
export class CoreModule { 
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
