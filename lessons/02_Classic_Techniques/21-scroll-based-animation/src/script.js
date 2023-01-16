import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
	materialColor: '#ffeded',
	intensity: 0.75
}

gui.addColor(parameters, 'materialColor').onChange(() => {
	material.color.set(parameters.materialColor)
})
gui.add(parameters, 'intensity').min(0).max(1).step(0.01).onChange(() => {
	dirLight.intensity = parameters.intensity
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures for the Toon Shader
const texLoader = new THREE.TextureLoader()
const gradTex = texLoader.load('./textures/gradients/3.jpg')
gradTex.magFilter = THREE.NearestFilter

// Objects -> material & meshes
const material = new THREE.MeshToonMaterial({
	color: parameters.materialColor,
	gradientMap: gradTex
})

// distance between objects
const objDist = 4

const mesh1 = new THREE.Mesh(
	new THREE.TorusGeometry(1, 0.4, 16, 60),
	material
)

const mesh2 = new THREE.Mesh(
	new THREE.ConeGeometry(1, 2, 32),
	material
)

const mesh3 = new THREE.Mesh(
	new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
	material
)

mesh1.position.y = -objDist * 0
mesh2.position.y = -objDist * 1
mesh3.position.y = -objDist * 2

mesh1.position.x = 1.75
mesh2.position.x = -1.75
mesh3.position.x = 1.75

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

// Lights
const dirLight = new THREE.DirectionalLight('#FFFFFF', parameters.intensity)
dirLight.position.set(1, 1, 0)
scene.add(dirLight)

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Scroll
let scrollY = window.scrollY
window.addEventListener('scroll', () => {
	scrollY = window.scrollY
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
	const elapsedTime = clock.getElapsedTime()

	// animate camera
	camera.position.y = - scrollY / sizes.height * objDist

	// animate meshes
	for (const mesh of sectionMeshes) {
		mesh.rotation.x = elapsedTime * 0.1
		mesh.rotation.y = elapsedTime * 0.12
	}

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
