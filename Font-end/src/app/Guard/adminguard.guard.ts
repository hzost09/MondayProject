import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ServiceService } from '../service/Service.service';

export const adminguardGuard: CanActivateFn = (route, state) => {
  const authservice = inject(ServiceService);
  const redirect = inject(Router);
  if(authservice.isLogIn())
  {
      if(authservice.getRole() == 'User'){
        alert('not for user')
        redirect.navigate(['login']);

      }
      return true;
  }
  else{
    redirect.navigate(['login']);
    return false;
  }
};
