import { CanActivateFn, Router } from '@angular/router';
import { ServiceService } from '../service/Service.service';
import { inject } from '@angular/core';

export const userguardGuard: CanActivateFn = (route, state) => {
  const authservice = inject(ServiceService);
  const redirect = inject(Router);
if(authservice.isLogIn()){
  if(authservice.getRole() == 'Admin'){
    alert('not for admin')
    redirect.navigate(['login']);
  }
  return true;
}
else{
  redirect.navigate(['login'])
  return false
}
}

