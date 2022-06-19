import {AnimationMixer, AxesHelper, Clock, Color, CylinderGeometry,DoubleSide,LoopOnce,Mesh,MeshBasicMaterial, PerspectiveCamera, Scene, SpotLight, sRGBEncoding, Vector3, WebGLRenderer} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// import playertest from "./model_load.js";

// playertest();
const skill =[
  {"Damage":10,"AttackRange":20, "Speed":10}
]
// import CANNON from './../../cannon.min.js';
// var world = new CANNON.World();
// console.log(world);
let camera;
let scene;
let renderer;
let model;
let clock = new Clock();
let mixer;

let player;
const speed = 10;
init();

// 読み込み
function init() {
  //シーン
  scene = new Scene();

  //中心線の追加
  scene.add(new AxesHelper(5));

  //カメラの作成
  camera = new PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    800
  );
  console.log(`${window.innerHeight}${window.innerWidth}`);
  //カメラセット
  camera.position.x = 200;
  camera.position.y = 300;
  camera.position.z = 500;
  //原点にセット
  camera.lookAt(new Vector3(0, 0, 0));

  // 滑らかにカメラコントローラーを制御する
  const controls = new OrbitControls(camera, document.body);
  controls.enableDamping = true;
  controls.dampingFactor = 0.2;

  //光源
  const dirLight = new SpotLight(0xffffff, 1.5); //color,強度
  dirLight.position.set(-200, 300, 300);
  dirLight.castShadow = false;
  scene.add(dirLight);

  //レンダラー
  renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setClearColor(new Color(0xffffff));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = false;
  /*
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  console.log(plane)
*/
  const TowerGeometry = new CylinderGeometry(40, 40, 100, 10, 2, true);
  const TowerMaterial = new MeshBasicMaterial({
    color: 0xffff00,
    side: DoubleSide,
  });
  const Tower = new Mesh(TowerGeometry, TowerMaterial);
  scene.add(Tower);

  const loader = new FBXLoader();
  //オブジェクト読み込み
  loader.load(
    "../assets/untitled.fbx",
    function (object) {
      const modeLoadEnd = function (_mesh) {

      
      console.log(object);
      object.scale.set(1, 1, 1);
      //シーン内の特定のオブジェクトのアニメーション用のプレーヤー(アニメーションの調整)

      mixer = new AnimationMixer(object);

      //Animation Actionを生成
      const action = mixer.clipAction(object.animations[0]);

      //ループ設定（1回のみ）
      action.setLoop(LoopOnce);

      //アニメーションを再生する
      action.play();

      //オブジェクトとすべての子孫に対してコールバックを実行
      object.traverse((child) => {
        //影を落とすメッシュに対して、Shadowプロパティーを有効
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });
      scene.add(object);
      player = object;

    };
      setTimeout(modeLoadEnd( object ),10);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
  );

  //レンダラー実行関数
  function render() {
    renderer.render(scene, camera);
  }

  //リサイズ処理
  window.addEventListener("resize", onWindowResize);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
  }

  //アニメーション処理
  function animate() {
    if (mixer) {
      if (mixer) {
        mixer.update(clock.getDelta());
      }

      controls.update();
      render();
      //次のレンダラーを呼び出す
      requestAnimationFrame(animate);
    }

    controls.update();
    // render();
    // controls;
    requestAnimationFrame(animate);
    document.onkeydown = function (e) {
      console.log(e.key);
      switch (e.key) {
        case "w":
          player.position.x += skill.Speed;
          console.log(player.position);
          break;
        case "s":
          player.position.x -= skill.Speed;
          console.log(player.position);
          break;
        case "a":
          player.position.z -= skill.Speed;
          console.log(player.position);
          break;
        case "d":
          player.position.z += skill.Speed;
          console.log(player.position);
          break;
      }
    };
  }

  animate();

  //読み込んだシーンが暗いので、明るくする
  renderer.outputEncoding = sRGBEncoding;

  document.getElementById("WebGL-output").appendChild(renderer.domElement);
}
