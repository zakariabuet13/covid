import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TestService } from '../test.service';
import { Constants } from '../constants';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnInit {
  archive: any = [];
  totalCovid = 0;
  totalPneumonia = 0;

  loadingText = '';
  imageFolder = `${Constants.apiBaseUrl}/images/`;

  constructor(private spinner: NgxSpinnerService, private testService: TestService, private httpClient: HttpClient) {}

  ngOnInit() {
    this.loadingText = 'Please wait...';
    this.spinner.show();
    this.testService.getTests().subscribe((response: any) => {
      this.spinner.hide();
      this.archive = response.data.tests;

      console.log(this.archive);

      for (let test of this.archive) {
        if (test.covidProbability > test.pneumoniaProbability) {
          if (test.covidProbability > test.normalProbability) {
            this.totalCovid++;
          }
        } else if (test.pneumoniaProbability > test.normalProbability) {
          this.totalPneumonia++;
        }
      }
    });
  }

  loadHeatmap(image: any, index: any) {
    const headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 244, 244);
    const imgURL = canvas.toDataURL('image/jpeg');

    const base64String = imgURL.split('data:image/jpeg;base64,')[1];

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
        this.archive[index].resultImgURL = `data:image/jpeg;base64,${response.result}`;
      },
      (error) => {
        this.spinner.hide();
        alert('This feature is not available yet.');
        // console.log('Error:', error);
      }
    );
  }
}
