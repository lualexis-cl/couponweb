import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor() { }

  showLoading(titleLoading: string, detail: string) {
    Swal.fire({
      title: titleLoading,
      html: detail,
      allowOutsideClick: false,
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });
  }

  closeLoading() {
    Swal.close();
  }

  showMessageError(titleMessage: string, detailMessage: string) {
    Swal.fire({
      icon: 'error',
      title: titleMessage,
      text: detailMessage
    });
  }

  showSuccessMessage(titleMessage: string, detailMessage: string) {
    Swal.fire({
      icon: 'success',
      title: titleMessage,
      text: detailMessage
    });
  }

  showInfoMessage(titleMessage: string, detailMessage: string) {
    Swal.fire({
      icon: 'info',
      title: titleMessage,
      text: detailMessage
    });
  }

  confirmMessage(titleMessage: string, detailMessage: string,
                 textConfirm: string, textCancel: string) {
    return Swal.fire({
      title: titleMessage,
      text: detailMessage,
      allowOutsideClick: false,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: textCancel,
      cancelButtonText: textConfirm,
      reverseButtons: true
    });
  }
}
