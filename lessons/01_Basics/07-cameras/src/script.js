import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/*
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / sizes.width - 0.5
    cursor.y = - (e.clientY / sizes.height - 0.5)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
// fov -> use a fov between 45 and 75 mostly ( in degrees )
// aspect ratio -> the width of the render divided by its height
// near and far -> how close and how far the camera can see ( any object closer than near or further than far will not show up )
// avoid extreme values to prevent z-fighting
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000)
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
// get the distance of our camera
// console.log(camera.position.length)
camera.lookAt(mesh.position)
scene.add(camera)

// Orthographic Camera
// differs from PerspectiveCamera by its lack of perspective
// objects have the same sizes regardless of their distance to the camera
// Parameters
// instead of a fov, we provide how far the camera can see in each
// direction ( left, right, top, bottom ), then the near and far
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)
// camera.position.x = 2
// camera.position.y = 2
// camera.position.z = 2
// camera.lookAt(mesh.position)
// scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// by default the camera is looking at the center of the screen
// change the target property ( is a Vector3 )
// controls.target.y = 2
// controls.update()

// Damping will smooth the animation
// need to be updated each frames in tick function
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;

    // Update control
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
