import { Store } from './../../../_models/store';
import { Subscription } from 'rxjs';
import { StoreService } from './../../../_services/stores/store.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  store: Store;

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    this.subscription = this.storeService.getStoreList()
      .subscribe(stores => {
        this.store = stores[0];
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
