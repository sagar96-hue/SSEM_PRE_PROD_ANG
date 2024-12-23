import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReportsService } from '../Services/reports.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-training-report-upload',
  templateUrl: './training-report-upload.component.html',
  styleUrls: ['./training-report-upload.component.scss']
})
export class TrainingReportUploadComponent implements OnInit {

  constructor(private reportService:ReportsService) { }
  @ViewChild('alert', { static: false }) alertButton!: ElementRef;
  alertMessage!: string
  isLoader: boolean = false
  selectedFile: File | null = null;
  agreeCheck:boolean = false
  ngOnInit(): void {
    
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    
    if (this.selectedFile) {
      this.isLoader=true;
      this.reportService.upload(this.selectedFile).subscribe(response => {
        this.isLoader=false;
        this.showAlert('File uploaded successfully');

      }, error => {
        this.isLoader=false;
        this.showAlert('Oops somwthing went wrong');
      });
    }
  }

  downloadFormat()
  {
    let excelData: any[] = [];
     var dataToExport = {
      "Branch": "",
      "ParticipantID": "",
      "ParticipantName": "",
      "Designation": "",
      "DateofTraining": "",
      "TopicCovered": "",
      "TrainingCode": "",
      "PreScore": "",
      "PostScore": "",
      "GTMCode": "",
      "TrainingMedium ": "",
   
    }
    excelData.push(dataToExport)
   

    const ws = XLSX.utils.json_to_sheet(excelData);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'Training Delivery Data Upload Format.xlsx');

     this.showAlert("Format has been downloaded")
  }

  
  showAlert(message: string) {

    this.alertMessage = message
    this.alertButton.nativeElement.click();
  }
}
