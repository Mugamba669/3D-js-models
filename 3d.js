let scene,plane,box,renderer,camera;
scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xa0a0a0 );;
scene.fog = new THREE.Fog( 0xa0a0a0 ,200,1000)
// console.log(scene)
camera = new THREE.PerspectiveCamera(80,window.innerWidth / window.innerHeight,4,500);
camera.position.set(100, 200, 300 );
// var frustumSize = 500;
// const aspect = window.innerWidth / window.innerHeight;
// camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
//
// camera.position.set( - 200, 200, 200 );
camera.lookAt(scene.position);

renderer  = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth,window.innerHeight);
// orbit
var orbit = new THREE.OrbitControls(camera,renderer.domElement);
orbit.update();
// orbit.target.set(0,100,0);
scene.add(orbit);
// renderer.receiveShadow = true;
//PointLight
// var pointLight = new THREE.PointLight(0x000000);
// pointLight.distance = 200;
// pointLight.intesity = 3;
// scene.add(pointLight);
// Ambientlight
var ambientLight = new THREE.AmbientLight(0x00fff00,1);
// scene.add(ambientLight);

// Spotlight
var pointColor = 0xffffff;
var spotLight = new THREE.SpotLight(pointColor);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
spotLight.target = plane;
// scene.add(spotLight);
// const dirLight = new THREE.DirectionalLight( 0xffffff );
// dirLight.position.set( 0, 200, 100 );
// dirLight.castShadow = true;
// dirLight.shadow.camera.top = 180;
// dirLight.shadow.camera.bottom = - 100;
// dirLight.shadow.camera.left = - 120;
// dirLight.shadow.camera.right = 120;
// scene.add( dirLight );
// Dkrectional light
const directionLight = new THREE.DirectionalLight(0x00ff00);
directionLight.position.set( 0, 200, 100 );
directionLight.castShadow = true;
// directionLight.shadow.camera.near = 2;
directionLight.shadow.camera.far = 200;
directionLight.shadow.camera.right = -120;
directionLight.shadow.camera.left = -120
directionLight.shadow.camera.top= 180;
directionLight.shadow.camera.bottom = -100;
scene.add(directionLight);

// const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
// hemiLight.position.set( 0, 200, 0 );
// scene.add( hemiLight );
// Hemisphere light
var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set(0, 500, 0);
    scene.add(hemiLight);
    let container = document.getElementById("3d-gl");
    // document.body.appendChild(container);
    container.appendChild(renderer.domElement);

// box
const boxGem = new THREE.BoxGeometry(20,20,20);
const boxHe  = new THREE.MeshLambertMaterial({wireframe:false});
box = new THREE.Mesh(boxGem,boxHe);
box.receiveShadow = true;
// scene.add(box);
//
// 		// Load a glTF resource
var modal;
var url = 'Soldier.glb';
const loader = new THREE.GLTFLoader().setPath("./three.js-master/examples/models/gltf/");

	var loadModal = function(obj){
    loader.load(obj, function(gltf){
        modal = gltf.scene.children[0];
        modal.scale.set(0.5,0.5,0.5);
        modal.position.set(0.5,0.5,0.5);
        // modal.rotation.set(0,0,0);
        scene.add(gltf.scene);
        animate();
      });
  }
// const car = new THREE.GLTFLoader().setPath("./three.js-master/examples/models/gltf/CesiumMan/glTF-Embedded/");
// console.log(car)
// car.load("CesiumMan.gltf",function(glt){
//   var pos = glt.scene.children[0];
//   // pos.scale.set(1,1,1);
//   // pos.position.set(0,0,0);
//   // scene.add(glt.scene);
//   animate();
//

			// called while loading is progressi
// Plane Geomentry
var planeGeo = new THREE.PlaneGeometry(280,260,1,1);
var texture = new THREE.TextureLoader().load("./galaxy1.jpeg");
var planeMat = new THREE.MeshLambertMaterial({wireframe:false});
plane = new THREE.Mesh(planeGeo,planeMat);
plane.position.set(-10,-10,-2);
plane.rotation.x= -0.5*(Math.PI);
plane.rotation.z = 0;
// scene.add(plane);
// boxa
// const animationGroup = new THREE.AnimationObjectGroup();
//
// //
const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add( grid );
// const geometry = new THREE.BoxGeometry( 5, 5, 5 );
// const material = new THREE.MeshBasicMaterial( { transparent: true } );
//
// //

// for ( let i = 0; i < 100; i ++ ) {
//
//   for ( let j = 0; j < 10; j ++ ) {
//
//     const mesh = new THREE.Mesh( geometry, material );
//
//     mesh.position.x = 32 - ( 16 * i );
//     mesh.position.y = 0;
//     mesh.position.z = 32 - ( 16 * j );
//
//     scene.add( mesh );
//     animationGroup.add( mesh );
//
//   }
//
// }
var modals = ['Soldier.glb','Stork.glb','SittingBox.glb']
let animate = function(){
  window.requestAnimationFrame(animate);
  renderer.render(scene,camera);
  modal.rotation.z += 0.01;
}
// animate();

// User controls
var gui = new dat.GUI();
var controls = new function(){
this.intesity = 2;
this.sceneBackground = 0xfffffff;
this.ambientLight = 0xffffff;
this.ambientIntensity = 2
this.directionLight;
this.nearShadow = 0.2;
this.farShadow = 10;
this.rightShadow = -10;
this.leftShadow = -10;
this.topShadow = 10;
this.bottomShadow = -10;
this.directionColor = 0x00ff00;
this.groundColor = 0x000ff0;
this.skyColor = 0xffffff;
this.hemisphereIntensity = 0.6;
this.modalx = 0.5;
this.modaly = 0.5;
this.modalz = 0.5;
this.posX = 0;
this.posY = 0;
this.posZ = 0;
this.rotateX = 0;
this.rotateY = 0;
this.rotateZ = 0;
this.object = 'Soldier.glb';
}
loadModal('Soldier.glb')
// ground Color
gui.addColor(controls,'groundColor').onChange(e => hemiLight.groundColor = new THREE.Color(e));
gui.addColor(controls,'skyColor').onChange(e => hemiLight.color = new THREE.Color(e));
gui.add(controls,'hemisphereIntensity',0,2).onChange(e => hemiLight.intesity = new THREE.Color(e));
// pointlight intesnity
gui.add(controls,"intesity",0,3,).onChange(e => pointLight.intesity = e);
// background color
gui.addColor(controls,"sceneBackground").onChange(e => scene.background = new THREE.Color(e));
// gui.add(controls,'directionLight');
// near shadow
gui.add(controls,'nearShadow',0,3).onChange(e => directionLight.shadow.camera.near = e)
// far shadow
gui.add(controls,'farShadow',1,200).onChange((e)=> directionLight.shadow.camera.near = e)
// right shadow
gui.add(controls,'rightShadow',-80,0).onChange((e) => directionLight.shadow.camera.near = e)
// left shadow
gui.add(controls,'leftShadow',-80,0).onChange(e => directionLight.shadow.camera.near = e);
// AmbientLight
gui.addColor(controls,'ambientLight').onChange(e => ambientLight.color = new THREE.Color(e));
// Ambient Intensity
gui.add(controls,'ambientIntensity',0,20).onChange(e => ambientLight.intensity = e);
// top shadow

gui.add(controls,'topShadow',0,100).onChange(e => directionLight.shadow.camera.near = e)
// bottom shadow
gui.add(controls,'bottomShadow',0,-80).onChange(e => directionLight.shadow.camera.near = e)
// directionColr
gui.addColor(controls,'directionColor').onChange(e => directionLight.color = new THREE.Color(e));
// Modal scaling in x,y,z;
gui.add(controls,'modalx',0,1).onChange(e => modal.scale.x = e);
gui.add(controls,'modaly',0,1).onChange(e => modal.scale.y = e);
gui.add(controls,'modalz',0,1).onChange(e => modal.scale.z = e);
// ///////////////////////////////////////////////////
// Modal position in x,y,z;
gui.add(controls,'posX',0,100).onChange(e => modal.position.x = e);
gui.add(controls,'posY',-100,100).onChange(e => modal.position.y = e);
gui.add(controls,'posZ',0,100).onChange(e => modal.position.z = e);
// ///////////////////////////////////////////////////
// rotating
gui.add(controls,'rotateX',0,0.01).onChange(e => modal.rotation.x = e);
gui.add(controls,'rotateY',-100,0.01).onChange(e => modal.rotation.y = e);
gui.add(controls,'rotateZ',0,0.01).onChange(e => modal.rotation.z = e);
// ///////////////////////////////////////////////////
// 3d modal
var glt = {object:"Soldier.glb"};
var gltfFolder = gui.addFolder('Modals').add(glt,'object').options(modals).onChange(() => loadModal(glt.object));
// gltfFolder.open();
// on resize
window.onresize = e => {
renderer.setSize(window.innerWidth,window.innerHeight);
camera.aspect = window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
}
