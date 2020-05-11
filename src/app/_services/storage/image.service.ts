import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private storage: AngularFireStorage) { }

  deteleImage(downloadUrl: string) {
    return this.storage.storage.refFromURL(downloadUrl)
      .delete();
  }
}
