import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  uploadedFile: any;
  fileTypes = ['.png', '.jpg', '.jpeg'];
  imgURL: any;
  result: any;
  resultImgURL: any;

  constructor(private spinner: NgxSpinnerService) {}

  uploadFile(fileList: any) {
    if (fileList.length > 0) {
      if (fileList.length > 1) {
        alert('Upload 1 photo only');
        return;
      }

      const file = fileList[0];
      const isValid = this.validateFile(file);

      if (isValid) {
        this.spinner.show();
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setTimeout(() => {
            this.spinner.hide();

            this.uploadedFile = file.name;
            this.imgURL = reader.result;
            this.resultImgURL = reader.result;
            this.result = 'dsfsd';
          }, 2000);
        };
      }
    }
  }

  validateFile(file: any) {
    if (!file) return;

    const fileParts = file.name.split('.');
    const fileType = fileParts[fileParts.length - 1].toLowerCase();

    if (!this.fileTypes.includes(`.${fileType}`)) {
      const alertMsg = `Please only upload file of types: \n${this.fileTypes.join(', ')}`;
      alert(alertMsg);

      return false;
    }

    return true;
  }
}
