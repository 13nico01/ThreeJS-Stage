import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  ngAfterViewInit() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.5,
      1000
    );
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);

    const container = document.getElementById('threejs-container');
    if (container) {
      container.appendChild(renderer.domElement);
    }

    camera.position.z = 10;

    const ambientLight = new THREE.AmbientLight(0xffffff, 100);
    scene.add(ambientLight);

    const spotLight1 = new THREE.SpotLight(0xffffff, 1);
    spotLight1.position.set(0, 0, 0);
    spotLight1.target.position.set(0, 0, 0);
    scene.add(spotLight1);
    scene.add(spotLight1.target);

    const loader = new GLTFLoader();
    loader.load('../../assets/stage.glb', (gltf) => {
      const model = gltf.scene;
      scene.add(model);
    });

    const controls = new OrbitControls(camera, renderer.domElement);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }
}
