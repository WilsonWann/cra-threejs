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
        console.log(cursor.x, cursor.y)
      })

      // document.body.appendChild( renderer.domElement )
      // use ref as a mount point of the Three.js scene instead of the document.body
      refContainer.current && refContainer.current.appendChild(renderer.domElement)
      var geometry = new THREE.BoxGeometry(1, 1, 1)
      var geometry3 = new THREE.BoxGeometry(2, 0.5, 1)
      var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
      var material2 = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
      var material3 = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true })
      var cube = new THREE.Mesh(geometry, material)
      var cube2 = new THREE.Mesh(geometry, material2)
      cube2.position.set(1, 1, 1)
      var cube3 = new THREE.Mesh(geometry3, material3)
      cube3.position.set(-1. - 2, -1)
      const group = new THREE.Group()

      scene.add(group)

      group.add(cube)
      group.add(cube2)
      group.add(cube3)
      var axesHelper = new THREE.AxesHelper(10)
      scene.add(axesHelper)

      // scene.add(cube)
      const UPPER_LIMIT = 10
      const LOWER_LIMIT = 0
      const PI = Math.PI
      camera.position.x = 0
      camera.position.y = 0
      camera.position.z = 5
      const camera_oscillate_x = createOscillator(camera.position.x, PI, 0)
      const camera_oscillate_y = createOscillator(camera.position.y, PI / 2, -PI / 2)
      const camera_oscillate_z = createOscillator(camera.position.z, UPPER_LIMIT, LOWER_LIMIT)

      const cube3_y_oscillate = createOscillator(cube3.position.y, 1, -1)

      const clock = new THREE.Clock()

      const animate = contextSafe(() => {
        gsap.to(group.position, { duration: 1, delay: 1, x: 4 })
        gsap.to(group.rotation, { duration: 1, delay: 3, z: PI * 0.5 })
        gsap.to(group.position, { duration: 1, delay: 4, x: 0 })
        gsap.to(group.rotation, { duration: 1, delay: 6, z: 0 })
      })

      setInterval(() => {

        animate()
      }, 7_000)

      var animate1 = function () {
        const elapsedTime = clock.getElapsedTime()
        // camera.position.x = cursor.x
        // camera.position.y = cursor.y
        requestAnimationFrame(animate1)
        const x_oscillate = createCosineOscillator(camera_oscillate_x())
        const y_oscillate = createSineOscillator(camera_oscillate_y())
        camera.position.x = x_oscillate()
        camera.position.y = y_oscillate()
        camera.position.z = camera_oscillate_z()
        cube.rotation.x += 0.01 * Math.sin(elapsedTime)
        cube.rotation.y += 0.01 * Math.cos(elapsedTime)
        renderer.render(scene, camera)
      }
      animate1()
      var animate2 = function () {
        requestAnimationFrame(animate2)
        cube2.rotation.x -= 0.01
        cube2.rotation.y -= 0.01
        renderer.render(scene, camera)
      }
      animate2()
      var animate3 = function () {
        requestAnimationFrame(animate3)
        const y_oscillate = createSineOscillator(cube3_y_oscillate())
        cube3.position.y = y_oscillate()
        cube3.rotation.x -= 0.01
        cube3.rotation.y += 0.01
        renderer.render(scene, camera)
      }
      animate3()
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