import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

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
	particlesMat.color.set(parameters.materialColor)
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

// Particles
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)
for (let i = 0; i < particlesCount; i++) {
	positions[i * 3 + 0] = (Math.random() - 0.5) * 10
	positions[i * 3 + 1] = objDist * 0.5 - Math.random() * objDist * sectionMeshes.length
	positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}
// init the BufferGeometry and set the pos attribute
const particlesGeo = new THREE.BufferGeometry()
particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
// particles material -> PointsMaterial
const particlesMat = new THREE.PointsMaterial({
	color: parameters.materialColor,
	sizeAttenuation: true,
	size: 0.03
})
// create the particles
const particles = new THREE.Points(particlesGeo, particlesMat)
scene.add(particles)

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
// add the camera to a Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

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
let currentSection = 0


window.addEventListener('scroll', () => {
	scrollY = window.scrollY
	const newSection = Math.round(scrollY / sizes.height)
	if (newSection != currentSection) {
		currentSection = newSection
		gsap.to(sectionMeshes[currentSection].rotation,
			{
				duration: 1.5,
				ease: 'power2.inOut',
				x: '+=6',
				y: '+=3',
				z: '+=1.5'
			})
	}
})

// retrieve the cursor position
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
	// normalize the values ( by dividing them by the viewport' sizes )
	cursor.x = event.clientX / sizes.width - 0.5
	cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
	const elapsedTime = clock.getElapsedTime()
	const deltaTime = elapsedTime - previousTime
	previousTime = elapsedTime

	// animate camera
	camera.position.y = - scrollY / sizes.height * objDist

	const parallaxX = cursor.x * 0.5
	const parallaxY = - cursor.y * 0.5
	// distance from actual pos to destination and apply deltaTime
	cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
	cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

	// animate meshes
	for (const mesh of sectionMeshes) {
		mesh.rotation.x += deltaTime * 0.1
		mesh.rotation.y += deltaTime * 0.12
	}

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
