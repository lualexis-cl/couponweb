import { ImageService } from './../../../_services/storage/image.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogService } from './../../../_services/dialogs/dialog.service';
import { Subscription, Observable } from 'rxjs';
import { CouponInfo } from './../../../_models/coupon-info';
import { Coupon } from './../../../_models/coupon';
import { CouponService } from './../../../_services/coupons/coupon.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateValidator } from 'src/app/validators/date-validator';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { faSave, faBackward } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-coupon',
  templateUrl: './edit-coupon.component.html',
  styleUrls: ['./edit-coupon.component.scss']
})
export class EditCouponComponent implements OnInit, OnDestroy {

  couponInfo: CouponInfo;
  subscription: Subscription;
  submittedForm: boolean;
  form: FormGroup;
  fileImage: any;
  couponEdited: boolean;
  faSave = faSave;
  faBackward = faBackward;

  constructor(private couponService: CouponService,
              private activatedRoute: ActivatedRoute,
              private dialog: DialogService,
              private route: Router,
              private imageService: ImageService,
              private storage: AngularFireStorage) { }

  ngOnInit(): void {
    // this.route.snapshot.params['id'];
    const id = this.activatedRoute.snapshot.params['id'] as string;
    console.log(id);
    this.dialog.showLoading('', 'Obteniendo información...');

    this.subscription = this.couponService.getSingle(id)
      .subscribe(coupons => {
        this.dialog.closeLoading();
        this.couponInfo = coupons;

        this.setDataForm();

        if (this.couponEdited) {
          this.dialog.showSuccessMessage('', 'Se ha actualizado correctamente el Coupon');
          this.couponEdited = false;
        }
      });

    this.form = new FormGroup({
      nameCoupon: new FormControl('', Validators.required),
      expiration: new FormControl('', Validators.compose([Validators.required,
                                                          DateValidator.date,
                                                          DateValidator.dateMin,
                                                          DateValidator.dateMax])),
      totalCoupon: new FormControl('', [Validators.required,
                                        Validators.min(1),
                                        Validators.max(999999)]),
      imageCoupon: new FormControl(''),
      text: new FormControl('', Validators.required)
    });
  }

  setDataForm() {
    this.form.controls.nameCoupon.setValue(this.couponInfo.nameCoupon);
    this.form.controls.expiration.setValue(this.couponInfo.expiration);
    this.form.controls.totalCoupon.setValue(this.couponInfo.totalCoupon);
    this.form.controls.text.setValue(this.couponInfo.text);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  back() {
    this.route.navigate(['/couponList']);
  }

  get f(){
    return this.form.controls;
  }

  onImageChange(event) {
    this.fileImage = null;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileImage = file;
    }
  }

  editCoupon() {
    this.submittedForm = true;

    if (this.form.valid) {
      this.dialog.showLoading('', 'Editando información...');
      this.saveEditCoupon();
    }
  }

  saveEditCoupon() {

    if (this.fileImage != null) {
      this.editImage();
    } else {
      this.saveCoupon(this.couponInfo.urlImage);
    }

  }

  saveCoupon(urlImage: string) {
    const coupon = this.form.value as Coupon;
    coupon.urlImage = urlImage;
    coupon.couponAvailable = this.couponInfo.couponAvailable;

    if (this.couponInfo.totalCoupon !== coupon.totalCoupon) {
      let couponUsings = 0;

      if (this.couponInfo.couponAvailable !== this.couponInfo.totalCoupon) {
        couponUsings = this.couponInfo.totalCoupon - this.couponInfo.couponAvailable;
      }

      coupon.couponAvailable = coupon.totalCoupon - couponUsings;

      if (coupon.couponAvailable < 0) {
        coupon.couponAvailable = 0;
      }
    }

    this.couponService.update(this.couponInfo.key, coupon)
      .then(result => {
        this.dialog.closeLoading();
        this.couponEdited = true;
        this.submittedForm = false;
        this.fileImage = null;
        this.ngOnInit();
      }).catch(err => {
        this.dialog.closeLoading();
        this.dialog.showMessageError('Error', `Se produjo un error inesperado ${err.message}`);
      });
  }

  editImage() {
    this.imageService.deteleImage(this.couponInfo.urlImage)
      .then(result => {
        this.saveImage();
      }).catch(err => {
        this.dialog.closeLoading();
        this.dialog.showMessageError('Error', `Se produjo un error inesperado ${err.message}`);
      });
  }

  saveImage() {
    const now = Date.now();
    const filePath = `RoomsImages/${now}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${now}`, this.fileImage);

    task
      .snapshotChanges()
      .pipe(finalize(() => {
        const downLoadUrl: Observable<string> = fileRef.getDownloadURL();

        return downLoadUrl.subscribe(url => {
          const urlImage = url;
          this.saveCoupon(urlImage);
        });
      })).subscribe();
  }
}
