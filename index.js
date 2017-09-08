var camera, controls, scene, renderer, geomentry;

function init() {

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 3000);
  camera.position.z = 500;

  controls = new THREE.OrbitControls(camera, renderer.domElement);


  //  что есть на сцене
  var texture = (new THREE.TextureLoader).load('particle.png');
  var material = new THREE.PointCloudMaterial({
    size: 10,
    vertexColors: THREE.VertexColors,
    map: texture
  });

  geomentry = new THREE.Geometry();
  var x, y, z;

  // Точки
  for (var i = 0; i <= 100; i++) {
    x = Math.sin(i / 10) * 100;
    y = 0;
    z = i * 10;

    geomentry.vertices.push(new THREE.Vector3(x, y, z));
    geomentry.colors.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
  }

  var pointCloud = new THREE.PointCloud(geomentry, material);
  scene.add(pointCloud);
  // конец сцены

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth / window.innerHeight);
}

var i = 0;

function animate() {
  i++;
  requestAnimationFrame(animate);

  geomentry.vertices.forEach((particle, index) => {
    let dX, dY, dZ;
    dX = Math.sin(i/10 + index/2)/2;
    dY = 0;
    dY = 0;

      particle.add(new THREE.Vector3(dX, dY, dZ))

});


  geomentry.verticesNeedUpdate = true;

  render();
}

function render() {
  renderer.render(scene, camera);
}

init();
animate();



