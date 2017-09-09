let size = 50;
let canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
canvas.width = size;
canvas.height = size;
canvas.classList.add('tempcanvas');
document.body.appendChild(canvas);


function loadImages(paths, whenLoaded) {
  let imgs = [];
  paths.forEach(path => {
    let img = new Image;
    img.onload = () => {
      imgs.push(img);
      if (imgs.length == paths.length) whenLoaded(imgs);
    };
    img.src = path;
  })
}

function fillUp(array, max) {
  let lenght = array.length;
  for (let i = 0; i < max - lenght; i += 1) {
    array.push(array[Math.floor(Math.random() * lenght)])
  }
  return array;
}

function getArrayFromImage(img) {
  let imageCoords = [];

  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(img, 0, 0, size, size);
  let data = ctx.getImageData(0, 0, size, size);
  data = data.data;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let red = data[((size * y) + x) * 4];
      let green = data[((size * y) + x) * 4 + 1];
      let blue = data[((size * y) + x) * 4 + 2];
      let alpha = data[((size * y) + x) * 4 + 3];

      alpha && imageCoords.push([10 * (x - size / 2), 10 * (size / 2 - y)]);
    }
  }
  return fillUp(imageCoords, 1500);
}

let images = ['img/close.svg', 'img/arrow.svg', 'img/place.svg', 'img/particle.png' ];
loadImages(images, function (loadImages) {
  let gallery = [];
  loadImages.forEach((el, index) => {
    gallery.push(getArrayFromImage(loadImages[index]))
  });
  let img0 = getArrayFromImage(loadImages[0]);
  let img1 = getArrayFromImage(loadImages[1]);


  let camera, controls, scene, renderer, geomentry;

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
      map: texture,
      alphaTest: .1
    });

    geomentry = new THREE.Geometry();
    var x, y, z;

    // Точки
    // for (var i = 0; i <= 100000; i++) {
    //   x = Math.sin(i / 10) * 100;
    //   y = Math.cos(i / 10)* 100;
    //   z = i;
    //
    //   geomentry.vertices.push(new THREE.Vector3(x, y, z));
    //   geomentry.colors.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
    //
    // }

    gallery[0].forEach((el, index) => {
      geomentry.vertices.push(new THREE.Vector3(el[0], el[1], Math.random() * 100));
      geomentry.colors.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
    });

    let pointCloud = new THREE.PointCloud(geomentry, material);
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
      dX = Math.sin(i / 10 + index / 2) / 2;
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

let current = 0;
document.body.addEventListener('click', () => {
  current++;
  current = current % gallery.length;
  geomentry.vertices.forEach((particle, index) => {
    let tl = new TimelineMax();
    tl.to(particle, 1, {x: gallery[current][index][0], y: gallery[current][index][1]})});
}, true);





});
// };
//
// img.src = "img/close.svg";


