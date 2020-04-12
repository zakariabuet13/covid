import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import * as tf from '@tensorflow/tfjs';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  loadingText = '';

  uploadedFile: any;
  fileTypes = ['.png', '.jpg', '.jpeg'];
  imgURL: any;
  result: any;
  resultImgURL: any;

  model: tf.LayersModel;
  predictWorker: Worker;

  constructor(private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.initializePredictWorker();
    this.loadModel();
  }

  initializePredictWorker() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.predictWorker = new Worker('assets/predict-worker.worker.js');
      this.predictWorker.addEventListener('message', (event) => {
        this.result = event.data;
        console.log(event.data);
        this.result = this.result.map((probability: number) => (probability * 100).toFixed(2));

        this.spinner.hide();
      });
    } else {
      alert('Your browser needs to be updated to run this application properly.');
    }
  }

  loadModel() {
    this.loadingText = 'Setting up...';
    this.spinner.show();
    tf.loadLayersModel('assets/trained/model.json')
      .then((model: tf.LayersModel) => {
        this.spinner.hide();
        this.model = model;
      })
      .catch((err) => {
        this.spinner.hide();
        console.log(err);
        alert('Could not load resources properly');
      });
  }

  uploadFile(fileList: any) {
    if (fileList.length > 0) {
      if (fileList.length > 1) {
        alert('Upload 1 photo only');
        return;
      }

      const file = fileList[0];
      const isValid = this.validateFile(file);

      if (isValid) {
        this.loadingText = 'Analyzing...';
        this.spinner.show();
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (res: any) => {
          this.uploadedFile = file.name;
          this.imgURL = res.target.result;
          this.resultImgURL = this.imgURL;

          // const canvas = document.createElement('canvas');
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          const imageElement = document.createElement('img');

          imageElement.src = this.imgURL;
          canvas.width = 224;
          canvas.height = 224;
          imageElement.addEventListener('load', () => {
            context.drawImage(
              imageElement,
              0,
              0,
              imageElement.width,
              imageElement.height,
              0,
              0,
              canvas.width,
              canvas.height
            );
            let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            this.predictWorker.postMessage({ data: imageData });
          });
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
