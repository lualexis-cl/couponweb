import { ImageService } from './../../../_services/storage/image.service';
import { CouponInfo } from './../../../_models/coupon-info';
import { DialogService } from './../../../_services/dialogs/dialog.service';
import { Subscription } from 'rxjs';
import { CouponService } from './../../../_services/coupons/coupon.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { faTrash, faEdit, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.scss']
})
export class CouponListComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  collectionSize = 0;
  page = 1;
  coupons: CouponInfo[];
  faTrash = faTrash;
  faEdit = faEdit;
  faPlusCircle = faPlusCircle;

  constructor(private couponService: CouponService,
              private route: Router,
              private dialog: DialogService,
              private imageService: ImageService) { }

  ngOnInit(): void {
    this.subscription = this.couponService.getCouponList()
      .subscribe(coupons => {
        this.collectionSize = coupons.length;
        this.coupons = coupons.reverse();

        if (coupons.length === 0) {
          this.dialog.closeLoading();
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createCoupon() {
    this.route.navigate(['/createCoupon']);
  }

  deleteCoupon(key: string, urlImage: string) {
    this.dialog.confirmMessage('Confirmación', '¿Está seguro que desea eliminar el Cupón seleccionado?',
      'No, Cancelar', 'Si, Eliminarlo')
      .then((result) => {
        if (result.value) {
          this.dialog.showLoading('', 'Procesando información...');
          this.confirmDeleteCoupon(key, urlImage);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  }

  confirmDeleteCoupon(key: string, urlImage: string) {
    this.couponService.delete(key)
      .then(response => {
        this.deleteImage(urlImage);
      }).catch(err => {
        this.dialog.closeLoading();
        this.dialog.showMessageError('Error', `Se produjo un error inesperado ${err.message}`);
      });
  }

  deleteImage(urlImage: string) {
    this.imageService.deteleImage(urlImage)
      .then(response => {
        this.dialog.closeLoading();
        this.dialog.showSuccessMessage('', 'Cupón eliminado correctamente!');
      }).catch(err => {
        this.dialog.closeLoading();
        this.dialog.showMessageError('Error', `Se produjo un error inesperado ${err.message}`);
      });
  }

  goToEditCoupon(key: string) {
    this.route.navigate([`/editCoupon/${key}`]);
  }
}
