import * as THREE from 'three'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useEffect, useRef } from 'react'

function MyThree() {

  const refContainer = useRef()
  const effectRan = useRef(false)

  const { contextSafe } = useGSAP({ scope: refContainer })

  useEffect(() => {

    function createOscillator(start, upperLimit, lowerLimit) {
      let direction = 0.01;
      let value = start;

      return function getNextValue() {
        value += direction;
        if (value >= upperLimit || value <= lowerLimit) {
          direction *= -1;
        }
        return value;
      };
    }
    function createSineOscillator(value) {
      return function getSineValue() {
        return Math.sin(value)
      }
    }
    function createCosineOscillator(value) {
      return function getCosineValue() {
        return Math.cos(value)
      }
    }

    if (effectRan.current === true) {

      // === THREE.JS CODE START ===
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
      }
      const cursor = { x: 0, y: 0 }
      var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      var scene = new THREE.Scene()

      var renderer = new THREE.WebGLRenderer()
      renderer.setSize(sizes.width, sizes.height)
      window.addEventListener('resize', () => {
        // update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // update renderer
        renderer.setSize(sizes.width, sizes.height)
      })
      window.addEventListener('mousemove', (event) => {
        cursor.x = event.clientX / window.innerWidth - 0.5 // 原因是希望x軸的數值在-0.5至0.5之間, 螢幕中心為0 
        cursor.y = 0.5 - event.clientY / window.innerHeight // 原因是希望y軸的數值在-0.5至0.5之間, 螢幕中心為0 
        // console.log(cursor.x, cursor.y)
      })

      // document.body.appendChild( renderer.domElement )
      // use ref as a mount point of the Three.js scene instead of the document.body
      refContainer.current && refContainer.current.appendChild(renderer.domElement)
      var geometry = new THREE.BoxGeometry(1, 1, 1)
      var planeGeometry = new THREE.PlaneGeometry(1, 1)
      var circleGeometry = new THREE.CircleGeometry(2, 100)
      var coneGeometry = new THREE.ConeGeometry(1, 3, 100)
      var cylinderGeometry = new THREE.CylinderGeometry(2, 2, 2, 100)
      var ringGeometry = new THREE.RingGeometry(1, 3, 30, 100)
      var torusGeometry = new THREE.TorusGeometry(2, 1, 80, 80)
      var bufferGeometry = new THREE.BufferGeometry()

      const positionArray = new Float32Array(9)
      positionArray[0] = 0
      positionArray[1] = 0
      positionArray[2] = 0

      positionArray[3] = 0
      positionArray[4] = 1
      positionArray[5] = 0

      positionArray[6] = 1
      positionArray[7] = 0
      positionArray[8] = 0
      // var geometry3 = new THREE.BoxGeometry(2, 0.5, 1)
      var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
      var material2 = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, wireframe: true })
      var material_buffer = new THREE.MeshBasicMaterial({ color: 0x06ff06, wireframe: true })
      var cube = new THREE.Mesh(geometry, material)
      var plane = new THREE.Mesh(planeGeometry, material2)
      var circle = new THREE.Mesh(circleGeometry, material2)
      var cone = new THREE.Mesh(coneGeometry, material2)
      var cylinder = new THREE.Mesh(cylinderGeometry, material2)
      var ring = new THREE.Mesh(ringGeometry, material2)
      var torus = new THREE.Mesh(torusGeometry, material2)
      bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))

      var buffer = new THREE.Mesh(bufferGeometry, material_buffer)
      scene.add(buffer)

      var axesHelper = new THREE.AxesHelper(10)
      scene.add(axesHelper)

      const UPPER_LIMIT = 10
      const LOWER_LIMIT = 0
      const PI = Math.PI
      camera.position.x = 0
      camera.position.y = 0
      camera.position.z = 5
      const camera_oscillate_x = createOscillator(camera.position.x, PI, 0)
      const camera_oscillate_y = createOscillator(camera.position.y, PI / 2, -PI / 2)
      const camera_oscillate_z = createOscillator(camera.position.z, UPPER_LIMIT, LOWER_LIMIT)

      const clock = new THREE.Clock()

      var animate1 = function () {
        const elapsedTime = clock.getElapsedTime()
        // camera.position.x = cursor.x
        // camera.position.y = cursor.y
        requestAnimationFrame(animate1)
        const x_oscillate = createCosineOscillator(camera_oscillate_x())
        const y_oscillate = createSineOscillator(camera_oscillate_y())
        camera.position.x = x_oscillate()
        camera.position.y = y_oscillate()
        // camera.position.z = camera_oscillate_z()
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01

        // cone.rotation.z = PI / 2
        renderer.render(scene, camera)
      }
      animate1()
    }
    return () => {
      effectRan.current = true
    }
  }, [contextSafe])

  useEffect(() => {

  }, []);
  return (
    <div ref={refContainer} />
  )
}

export default MyThree