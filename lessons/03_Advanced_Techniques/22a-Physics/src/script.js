import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'

/**
 * Debug
 */
const gui = new dat.GUI()
// dat needs an object to be passed in
const debugObj = {}

// gui create sphere
debugObj.createSphere = () => {
	createSphere(Math.random() * 0.5,
		{
			x: (Math.random() - 0.5) * 3,
			y: 3,
			z: (Math.random() - 0.5) * 3
		})
}

// gui create box
debugObj.createBox = () => {
	createBox(
		Math.random(),
		Math.random(),
		Math.random(),
		{
			x: (Math.random() - 0.5) * 3,
			y: 3,
			z: (Math.random() - 0.5) * 3
		}
	)
}

debugObj.reset = () => {
	for (const obj of objToUpd) {
		// remove body
		obj.body.removeEventListener('collide', playHitSnd)
		world.removeBody(obj.body)
		// remove mesh
		scene.remove(obj.mesh)
		// empty the objToUpd array
		objToUpd.splice(0, objToUpd.length)
	}
}

gui.add(debugObj, 'createSphere')
gui.add(debugObj, 'createBox')
gui.add(debugObj, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Sounds
const hitSnd = new Audio('./sounds/hit.mp3')
const playHitSnd = (collision) => {
	const impactStrength = collision.contact.getImpactVelocityAlongNormal()
	if (impactStrength > 1.5) {
		hitSnd.volume = Math.random()
		hitSnd.currentTime = 0
		hitSnd.play();
	}
}

/**
 * Textures
 */
// const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
	'/textures/environmentMaps/0/px.png',
	'/textures/environmentMaps/0/nx.png',
	'/textures/environmentMaps/0/py.png',
	'/textures/environmentMaps/0/ny.png',
	'/textures/environmentMaps/0/pz.png',
	'/textures/environmentMaps/0/nz.png'
])

// --- Physics --- //
const world = new CANNON.World()
// enable broadphase for better perfs
world.broadphase = new CANNON.SAPBroadphase(world)
// allow sleep for better perfs
world.allowSleep = true
// gravity on
world.gravity.set(0, -9.82, 0)

// materials
const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
	defaultMaterial,
	defaultMaterial,
	{
		friction: 0.1,
		restitution: 0.7
	}
)
world.defaultContactMaterial = defaultContactMaterial

// floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
	mass: 0,
	shape: floorShape,
})
floorBody.quaternion.setFromAxisAngle(
	new CANNON.Vec3(-1, 0, 0),
	Math.PI * 0.5
)
world.addBody(floorBody)

/**
 * Floor
 */
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		color: '#777777',
		metalness: 0.3,
		roughness: 0.4,
		envMap: environmentMapTexture,
		envMapIntensity: 0.5
	})
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Utils
// array that contains objects to be updated
const objToUpd = []
// Sphere
const sphereGeo = new THREE.SphereGeometry(1, 20, 20)
const sphereMat = new THREE.MeshStandardMaterial({
	metalness: 0.3,
	roughness: 0.4,
	envMap: environmentMapTexture
})

const createSphere = (radius, position) => {
	// three.js mesh
	const mesh = new THREE.Mesh(
		sphereGeo,
		sphereMat
	)
	mesh.scale.set(radius, radius, radius)
	mesh.castShadow = true
	mesh.position.copy(position)
	scene.add(mesh)

	// cannon.js body
	const shape = new CANNON.Sphere(radius)
	const body = new CANNON.Body({
		mass: 1,
		position: new CANNON.Vec3(0, 3, 0),
		shape: shape,
		material: defaultMaterial
	})
	body.position.copy(position)
	body.addEventListener('collide', playHitSnd)
	world.addBody(body)

	// save in objects to update ( objToUpd )
	objToUpd.push({
		mesh: mesh,
		body: body
	})
}

// Box
const boxGeo = new THREE.BoxGeometry(1, 1, 1)
const boxMat = new THREE.MeshStandardMaterial({
	metalness: 0.3,
	roughness: 0.4,
	envMap: environmentMapTexture
})

const createBox = (width, height, depth, position) => {
	// three.js mesh
	const mesh = new THREE.Mesh(
		boxGeo,
		boxMat
	)
	mesh.scale.set(width, height, depth)
	mesh.castShadow = true
	mesh.position.copy(position)
	scene.add(mesh)

	// cannon.js body
	const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
	const body = new CANNON.Body({
		mass: 1,
		position: new CANNON.Vec3(0, 3, 0),
		shape: shape,
		material: defaultMaterial
	})
	body.position.copy(position)
	body.addEventListener('collide', playHitSnd)
	world.addBody(body)

	// save in objects to update ( objToUpd )
	objToUpd.push({
		mesh: mesh,
		body: body
	})
}

// createSphere(0.5, { x: 0, y: 3, z: 0 })

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () => {
	const elapsedTime = clock.getElapsedTime()
	const deltaTime = elapsedTime - oldElapsedTime
	oldElapsedTime = elapsedTime

	// update physics world
	world.step(1 / 60, deltaTime, 3)

	// loop & upd the mesh position with the body position
	for (const obj of objToUpd) {
		obj.mesh.position.copy(obj.body.position)
		obj.mesh.quaternion.copy(obj.body.quaternion)
	}

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
