import { DateValidator } from './../../../validators/date-validator';
import { DialogService } from './../../../_services/dialogs/dialog.service';
import { CouponService } from './../../../_services/coupons/coupon.service';
import { Coupon } from './../../../_models/coupon';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { faSave, faBackward } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.scss']
})
export class CreateCouponComponent implements OnInit {

  form: FormGroup;
  fileImage; any;
  submittedForm: boolean;
  faSave = faSave;
  faBackward = faBackward;

  constructor(private route: Router,
              private storage: AngularFireStorage,
              private couponService: CouponService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      nameCoupon: new FormControl('', Validators.required),
      expiration: new FormControl('', Validators.compose([Validators.required,
                                                          DateValidator.date,
                                                          DateValidator.dateMin,
                                                          DateValidator.dateMax])),
      totalCoupon: new FormControl('', [Validators.required,
                                        Validators.min(1),
                                        Validators.max(999999)]),
      imageCoupon: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required)
    });
  }

  get f(){
    return this.form.controls;
  }

  back() {
    this.route.navigate(['/couponList']);
  }

  onImageChange(event) {
    this.fileImage = null;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileImage = file;
    }
  }

  saveCoupon() {
    this.submittedForm = true;

    if (this.form.valid) {
      console.log(this.fileImage);
      this.dialogService.showLoading('Por favor espere un momento!', 'Procesando Información');

      const coupon: Coupon = {
        couponAvailable: this.form.value.totalCoupon,
        expiration: this.form.value.expiration,
        nameCoupon: this.form.value.nameCoupon,
        text: this.form.value.text,
        totalCoupon: this.form.value.totalCoupon,
        urlImage: ''
      };

      this.saveImage(coupon);
    }
  }

  saveImage(coupon: Coupon) {
    const now = Date.now();
    const filePath = `RoomsImages/${now}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${now}`, this.fileImage);

    task
      .snapshotChanges()
      .pipe(finalize(() => {
        const downLoadUrl: Observable<string> = fileRef.getDownloadURL();

        return downLoadUrl.subscribe(url => {
          coupon.urlImage = url;
          this.saveData(coupon);
        });
      })).subscribe();
  }

  saveData(coupon: Coupon) {
    console.log(coupon);
    this.couponService.create(coupon)
      .then(result => {
        console.log('Ok ' + result);
        this.dialogService.closeLoading();
        this.form.reset();
        this.submittedForm = false;
        this.fileImage = null;

        this.dialogService.showSuccessMessage('', 'Cupón creado correctamente');
      }).catch(err => {
        console.log(err.message);
        this.dialogService.closeLoading();

        this.dialogService.showMessageError('Error', `Se produjo un error inesperado ${err.message}`);
      });
  }
}
