import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 

  @ViewChild('videoContainer', {static: true}) videoContainer!: ElementRef;
 
  
 

  
  ngOnInit() {
   this.startCamara();
   this.playEvento();
  }
  
  
  
  async startCamara(){
   
    var video = await navigator.mediaDevices.getUserMedia({ video: true });  

    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/assets/models');
   
    let stream =  this.videoContainer.nativeElement
    stream.srcObject = video;

  }  


  playEvento(){

    
    
    this.videoContainer.nativeElement.addEventListener('play',()=>{

      const canvas = faceapi.createCanvasFromMedia(this.videoContainer.nativeElement); 

    document.body.append(canvas);

     const displaySize = {width:this.videoContainer.nativeElement.width, height:this.videoContainer.nativeElement.height};

      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async()=>{

        const detections = await faceapi.detectAllFaces(this.videoContainer.nativeElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        canvas.getContext('2d')?.clearRect(0,0, canvas.width, canvas.height);

        faceapi.draw.drawDetections(canvas,resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas,resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas,resizedDetections);


      },1000)


    })

  }

}
