import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/*
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTex = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTex = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTex = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTex = textureLoader.load('/textures/door/height.jpg')
const doorNormalTex = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTex = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTex = textureLoader.load('/textures/door/roughness.jpg')
const matcapTex = textureLoader.load('/textures/matcaps/7.png')
const gradTex = textureLoader.load('/textures/gradients/5.jpg')
gradTex.minFilter = THREE.NearestFilter
gradTex.magFilter = THREE.NearestFilter
gradTex.generateMipmaps = false


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/*
 * Objects
 */
// const material = new THREE.MeshBasicMaterial({
//     color: 0xff00ff,
//     side: THREE.DoubleSide
// })

// const material = new THREE.MeshNormalMaterial()
// material.side = THREE.DoubleSide
// material.transparent = true
// material.opacity = 0.5

// const material = new THREE.MeshMatcapMaterial({
//     matcap: matcapTex,
//     side: THREE.DoubleSide
// })

// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide })
// const material = new THREE.MeshPhongMaterial({
//     side: THREE.DoubleSide,
//     shininess: 100,
//     specular: 0x1188ff
// })

// const material = new THREE.MeshToonMaterial({
//     side: THREE.DoubleSide,
//     gradientMap: gradTex
// })

const material = new THREE.MeshStandardMaterial()



const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
)

sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 1),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    material
)

torus.position.x = 1.5

scene.add(sphere, plane, torus)

/*
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(2, 3, 4)
scene.add(ambientLight, pointLight)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // update objects
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime
    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
