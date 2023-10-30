import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 

  @ViewChild('videoContainer', {static: true}) videoContainer!: ElementRef;
 
  
  /* Este error se debe a que angular-cli no admite módulos en nodos como "fs" y "path". Agregue lo siguiente al archivo "package.json" */

  
  ngOnInit() {
   this.startCamara();
   this.playEvento();
  }
  
  
  
  async startCamara(){
   
    var video = await navigator.mediaDevices.getUserMedia({ video: true });  

    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');    
    await faceapi.nets.faceExpressionNet.loadFromUri('/assets/models');
    await faceapi.nets.ageGenderNet.loadFromUri('/assets/models');
    let stream =  this.videoContainer.nativeElement
    stream.srcObject = video;

  }  

  /* @types/webgl2 WebGL (Biblioteca de gráficos web) y una API de JavaScript para renderizar gráficos 3D y 2D interactivos de alto rendimiento dentro de cualquier navegador web compatible sin el uso de complementos.Y se puede usar con la etiqueta HTML5 <canvas>
 */

  playEvento(){    
    
    this.videoContainer.nativeElement.addEventListener('play',()=>{

      const canvas = faceapi.createCanvasFromMedia(this.videoContainer.nativeElement); 

    document.body.append(canvas);

    canvas.setAttribute('id','idcanvas');

     const displaySize = {width:this.videoContainer.nativeElement.width, height:this.videoContainer.nativeElement.height};

      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async()=>{

        const detections = await faceapi.detectAllFaces(this.videoContainer.nativeElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        canvas.getContext('2d')?.clearRect(0,0, canvas.width, canvas.height);

        faceapi.draw.drawDetections(canvas,resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas,resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas,resizedDetections);
        resizedDetections.forEach( detection => {
          const box = detection.detection.box
          const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
          drawBox.draw(canvas)
        }) 

      },1000);


    })

  }

 
}
