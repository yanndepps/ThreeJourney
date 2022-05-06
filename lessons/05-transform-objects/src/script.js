import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

// Position
// mesh.position.x = 0.7
// mesh.position.y = -0.6
// mesh.position.z = 2
// change all values at once using the set(...) method
// mesh.position.set(0.0, 0.0, -1)


// get the length of a vector
// console.log('mesh pos -> ', mesh.position.length())

// normalize vector values
// console.log(mesh.position.normalize())

// Scale
// mesh.scale.set(2, 0.5, 0.5)

// Rotate Objects
// values expressed in radians -> half a rotation: Math.PI ( 3.14159... )
// watch for gimbal lock !
// change to order of rotation by using reorder(...) method
// mesh.rotation.reorder('YXZ')
// mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 0.0)

// Euler is easy to understand but this axis order can be problematic.
// this is why most engines and 3D softwares use Quaternion.
// quaternion updates when you change the rotation.

/*
 * Group
 */
const group = new THREE.Group()
scene.add(group)

const cube_1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
group.add(cube_1)

const cube_2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cube_2.position.x = -2
group.add(cube_2)

const cube_3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube_3.position.x = 2
group.add(cube_3)

group.position.y = 1
group.scale.y = 2
group.rotation.y = 1

/*
 * Axes Helper
 */
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Object3D instances have a lookAt(...) method which rotates the object
// so that the -z faces the target provided.
// the target must be a Vector3.
camera.lookAt(group.position)

// access the distance from a Vector3
// console.log(mesh.position.distanceTo(camera.position))

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
