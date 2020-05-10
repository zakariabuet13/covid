import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as tf from '@tensorflow/tfjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TestService } from '../test.service';

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

  userId = '';
  modelLoaded = false;
  canvas: any;

  constructor(
    private spinner: NgxSpinnerService,
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService,
    private testService: TestService
  ) {}

  ngOnInit() {
    this.initializePredictWorker();
    this.loadModel();

    const token = localStorage.getItem('token');
    this.userId = this.jwtHelper.decodeToken(token).id;
  }

  initializePredictWorker() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.predictWorker = new Worker('assets/predict-worker.worker.js');
      this.predictWorker.addEventListener('message', (event) => {
        this.spinner.hide();
        if (event.data === 'failed') {
          alert('Something went wrong! Please refresh the page and try again.');
        } else if (event.data === 'model loaded') {
          // console.log('model loaded');
          this.modelLoaded = true;
        } else {
          this.result = event.data;
          this.result = this.result.map((probability: number) => (probability * 100).toFixed(2));

          this.canvas.toBlob((blob) => {
            const args = {
              normalProbability: this.result[0],
              pneumoniaProbability: this.result[1],
              covidProbability: this.result[2],
              userId: this.userId,
            };

            this.loadingText = 'Please wait...';
            this.spinner.show();
            this.testService.saveTest(args, blob).subscribe((response) => {
              this.spinner.hide();
            });
          }, 'image/jpeg');
        }
      });
    } else {
      alert('Your browser needs to be updated to run this application properly.');
    }
  }

  loadModel() {
    this.loadingText = 'Setting up...';
    this.spinner.show();
    this.predictWorker.postMessage({ data: 'load-model' });
  }

  uploadFile(fileList: any) {
    if (fileList.length > 0) {
      if (fileList.length > 1) {
        alert('Upload 1 photo only');
        return;
      }

      const file = fileList[0];
      // console.log(file);
      const isValid = this.validateFile(file);

      if (isValid) {
        this.resultImgURL = null;
        this.loadingText = 'Analyzing...';
        this.spinner.show();
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (res: any) => {
          this.uploadedFile = file.name;
          // this.imgURL = res.target.result;
          // console.log(this.imgURL);
          // this.resultImgURL = this.imgURL;

          // const canvas = document.createElement('canvas');
          this.canvas = document.createElement('canvas');
          const context = this.canvas.getContext('2d');
          const imageElement = document.createElement('img');

          imageElement.src = res.target.result;
          this.canvas.width = 224;
          this.canvas.height = 224;
          imageElement.addEventListener('load', () => {
            context.drawImage(
              imageElement,
              0,
              0,
              imageElement.width,
              imageElement.height,
              0,
              0,
              this.canvas.width,
              this.canvas.height
            );
            // console.log(this.canvas.toDataURL('image/jpeg'));
            let imageData = context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            // console.log(imageData);
            this.predictWorker.postMessage({ data: imageData });

            this.imgURL = this.canvas.toDataURL('image/jpeg');
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

    const url = 'http://127.0.0.1:5000/heatmap';
    const body = {
      imageData: base64String,
    };

    this.loadingText = 'Generating heatmap...';
    this.spinner.show();
    this.httpClient.put<any>(url, JSON.stringify(body), headerOptions).subscribe(
      (response: any) => {
        this.spinner.hide();
        // console.log(response);
        this.resultImgURL = `data:image/jpeg;base64,${response.result}`;
      },
      (error) => {
        this.spinner.hide();
        alert('This feature is not available yet.');
        // console.log('Error:', error);
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
