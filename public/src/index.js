import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader.js';
// import CANNON from './../../cannon.min.js';
// var world = new CANNON.World();
// console.log(world);
let camera;
let scene;
let renderer;
let model;
let clock = new THREE.Clock();
let mixer;

let player;
const speed = 1;
init();

// 読み込み
function init() {
    //シーン
    scene = new THREE.Scene();

    //中心線の追加
    scene.add(new THREE.AxesHelper(5));

    //カメラの作成
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 5000);
    console.log(`${window.innerHeight}${window.innerWidth}`);
    //カメラセット
    camera.position.x = 200;
    camera.position.y = 300;
    camera.position.z = 500;
    //原点にセット
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 滑らかにカメラコントローラーを制御する
    const controls = new OrbitControls(camera, document.body);
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    //光源
    const dirLight = new THREE.SpotLight(0xffffff, 1.5); //color,強度
    dirLight.position.set(-200, 300, 300);
    dirLight.castShadow = true;
    scene.add(dirLight);

    //レンダラー
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    //fbxファイルの読み込み

    const loader = new FBXLoader();

    loader.load(
        '../assets/test.fbx',
        function (object) {
            console.log(object);
            player = object;
            object.scale.set(1, 1, 1);
            //シーン内の特定のオブジェクトのアニメーション用のプレーヤー(アニメーションの調整)
            mixer = new THREE.AnimationMixer(object);

            //Animation Actionを生成
            const action = mixer.clipAction(object.animations[0]);

            //アニメーションを再生する
            action.play();

            //オブジェクトとすべての子孫に対してコールバックを実行
            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(object);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');

            const progress = document.getElementById('progress');
            progress.value = xhr.loaded / xhr.total;
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
    window.addEventListener('resize', onWindowResize);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

    //アニメーション処理
    function animate() {
        if (mixer) {
            mixer.update(clock.getDelta());
        }

        controls.update();
        render();
        // controls();
        requestAnimationFrame(animate);
        document.onkeydown = function (e) {
            console.log(e.key);
            switch (e.key) {
                case 'w':
                    player.position.x += speed;
                    break;
                case 's':
                    player.position.x -= speed;
                    break;
                case 'a':
                    player.position.z -= speed;
                    break;
                case 'd':
                    player.position.z += speed;
            }
        };
    }

    animate();

    //読み込んだシーンが暗いので、明るくする
    renderer.outputEncoding = THREE.sRGBEncoding;

    document.getElementById('WebGL-output').appendChild(renderer.domElement);
}
