import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as tf from '@tensorflow/tfjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  loadingText = '';

  uploadedFile: any;
  fileTypes = ['.png', '.jpg', '.jpeg'];
  imgURL: any;
  result: any;
  resultImgURL: any;

  model: tf.LayersModel;
  predictWorker: Worker;

  constructor(
    private spinner: NgxSpinnerService,
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService
  ) {}

  ngOnInit() {
    this.initializePredictWorker();
    this.loadModel();

    const token = localStorage.getItem('token');
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
          // console.log(this.imgURL);
          // this.resultImgURL = this.imgURL;

          // const canvas = document.createElement('canvas');
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          const imageElement = document.createElement('img');

          imageElement.src = res.target.result;
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
            // console.log(canvas.toDataURL('image/jpeg'));
            let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            // console.log(imageData);
            this.predictWorker.postMessage({ data: imageData });

            this.imgURL = canvas.toDataURL('image/jpeg');
            // this.loadHeatmap();
          });
        };
      }
    }
  }

  loadHeatmap() {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const base64String = this.imgURL.split('data:image/jpeg;base64,')[1];

    const url = 'http://127.0.0.1:5000/';
    const body = {
      imageData: base64String,
    };

    this.loadingText = 'Generating heatmap...';
    this.spinner.show();
    this.httpClient.post<any>(url, JSON.stringify(body), headerOptions).subscribe(
      (response: any) => {
        this.spinner.hide();
        // console.log(response);
        this.resultImgURL = `data:image/jpeg;base64,${response.result}`;
      },
      (error) => {
        this.spinner.hide();
        console.log('Error:', error);
      }
    );
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
