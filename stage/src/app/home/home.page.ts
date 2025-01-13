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
import * as CANNON from 'cannon-es';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  ngAfterViewInit() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const container = document.getElementById('threejs-container');
    if (container) {
      container.appendChild(renderer.domElement);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(10, 20, 10);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 6;
    scene.add(spotLight);

    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    const physicsObjects: { mesh: THREE.Object3D; body: CANNON.Body }[] = [];

    const groundTexture = new THREE.TextureLoader().load(
      '../../assets/ground.jpg'
    );
    const groundNormalMap = new THREE.TextureLoader().load(
      '../../assets/normal.jpg',
      (texture) => {
        texture.repeat.set(5, 5);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
      }
    );

    const groundMaterial = new THREE.MeshStandardMaterial({
      map: groundTexture,
      normalMap: groundNormalMap,
      roughness: 0.8,
    });

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      groundMaterial
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    const loader = new GLTFLoader();
    loader.load('../../assets/stage01.glb', (gltf) => {
      const model = gltf.scene;

      const cubeTextureLoader = new THREE.CubeTextureLoader();
      const envMap = cubeTextureLoader.load([
        '../../assets/px.png',
        '../../assets/nx.png',
        '../../assets/py.png',
        '../../assets/ny.png',
        '../../assets/pz.png',
        '../../assets/nz.png',
      ]);
      scene.environment = envMap;

      const lights: THREE.Object3D[] = [];
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;

          if (mesh.name === 'disco') {
            mesh.material = new THREE.MeshStandardMaterial({
              color: 0xcccccc,
              metalness: 1.0,
              roughness: 0.1,
              envMap: envMap,
            });
          } else if (mesh.name === 'stage') {
            const woodTexture = new THREE.TextureLoader().load(
              '../../assets/wood.jpg'
            );
            woodTexture.wrapS = THREE.RepeatWrapping;
            woodTexture.wrapT = THREE.RepeatWrapping;
            woodTexture.repeat.set(2, 2);

            mesh.material = new THREE.MeshStandardMaterial({
              map: woodTexture,
            });
          }

          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }

        if (child.name.startsWith('light-')) {
          lights.push(child);
        }
      });

      const trussTop = model.getObjectByName('truss-top');
      if (trussTop) {
        const worldPosition = new THREE.Vector3();
        const worldQuaternion = new THREE.Quaternion();
        trussTop.getWorldPosition(worldPosition);
        trussTop.getWorldQuaternion(worldQuaternion);

        const trussBody = new CANNON.Body({
          mass: 0,
          shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
          position: new CANNON.Vec3(
            worldPosition.x,
            worldPosition.y,
            worldPosition.z
          ),
        });

        trussBody.quaternion.set(
          worldQuaternion.x,
          worldQuaternion.y,
          worldQuaternion.z,
          worldQuaternion.w
        );

        world.addBody(trussBody);
        physicsObjects.push({ mesh: trussTop, body: trussBody });

        renderer.domElement.addEventListener('click', (event) => {
          const mouse = new THREE.Vector2();
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObject(
            trussTop as THREE.Object3D,
            true
          );

          if (intersects.length > 0) {
            const trussBody = physicsObjects.find(
              (obj) => obj.mesh === trussTop
            )?.body;
            if (trussBody) {
              trussBody.mass = 1;
              trussBody.updateMassProperties();
            }
          }
        });
      }

      scene.add(model);

      const discoLights: THREE.PointLight[] = [];
      const discoPosition =
        model.getObjectByName('disco')?.position || new THREE.Vector3(0, 0, 0);

      for (let i = 0; i < 6; i++) {
        const pointLight = new THREE.PointLight(0xffffff, 10, 10);
        const angle = (i / 6) * Math.PI * 2;
        pointLight.position.set(
          discoPosition.x + Math.cos(angle) * 2,
          discoPosition.y + 2,
          discoPosition.z + Math.sin(angle) * 2
        );
        pointLight.castShadow = true;
        scene.add(pointLight);
        discoLights.push(pointLight);
      }

      function animateLights() {
        lights.forEach((light, index) => {
          const time = Date.now() * 0.001 + index * 0.5;
          light.rotation.x = Math.sin(time) * 0.5;
          light.rotation.z = Math.sin(time + index * 0.3) * 0.5;
        });
      }

      function animateDiscoLights() {
        discoLights.forEach((light, index) => {
          const hue = (Date.now() * 0.0005 + index * 0.1) % 1;
          light.color.setHSL(hue, 1, 0.5);
        });
      }

      const mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => mixer.clipAction(clip).play());

      const clock = new THREE.Clock();
      function animate() {
        const delta = clock.getDelta();
        world.step(delta);

        physicsObjects.forEach((obj) => {
          obj.mesh.position.set(
            obj.body.position.x,
            obj.body.position.y,
            obj.body.position.z
          );
          obj.mesh.quaternion.set(
            obj.body.quaternion.x,
            obj.body.quaternion.y,
            obj.body.quaternion.z,
            obj.body.quaternion.w
          );
        });

        animateLights();
        animateDiscoLights();
        mixer.update(delta);
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}
