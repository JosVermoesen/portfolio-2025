import {
  Directive,
  Input,
  ViewContainerRef,
  TemplateRef,
  OnInit,
} from '@angular/core';
import { take } from 'rxjs';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';

@Directive({
    selector: '[appHasRole]',
    standalone: true,
})
export class HasRoleDirective implements OnInit {
  @Input()
  appHasRole: string[] = [];
  user: User = {} as User;
  // isVisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private aService: AccountService
  ) {
    this.aService.currentUser$.pipe(take(1)).subscribe({
      next: (res) => {
        if (res) {
          this.user = res;
        }
      },
    });
  }

  ngOnInit() {
    // clear view if no roles
    /* if (!this.user?.roles || this.user == null) {
      this.viewContainerRef.clear();
      return;
    } */

    if (this.user?.roles.some((r) => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
