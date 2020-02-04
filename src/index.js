import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import p2 from 'p2'
import { useWindowWidth } from '@react-hook/window-size'
import delay from 'delay'
import style from './styles.module.css'

import characters from './characters'


const scaleCharacter = 0.133
const scaleContextSm = -200
const scaleContextLg = -100

const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const ssrWidth = 800

function LetterDrop() {
  
  const canvasRef = useRef()
  const rafRef = useRef()

  const windowWidth = useWindowWidth(ssrWidth, {
    wait: 1500,
    leading: false,
  })

  const DPR = window.devicePixelRatio || 1

  const worldRef = useRef()
  const genericMaterialRef = useRef()

  // Convert a canvas coordiante to physics coordinate
  function getPhysicsCoord(e, canvas, w2, h2, scaleContextSize) {
    const rect = canvas.getBoundingClientRect()
    let x = (e.clientX - rect.left) * DPR
    let y = (e.clientY - rect.top) * DPR

    x = (x - w2 / 2) / scaleContextSize
    y = (y - h2 / 2) / scaleContextSize

    return [x, y]
  }


  function drawPlane(planeBody, ctx, w2) {
    const y = planeBody.position[1]
    ctx.moveTo(-w2, y)
    ctx.lineTo(w2, y)
  }


  // world and character set up, runs only once.
  useEffect(() => {
    worldRef.current = new p2.World({
      gravity: [0, -9.82],
      islandSplit: true,
      // Defaults to SAPBroadphase
    })
    

    // https://github.com/schteppe/p2.js/issues/251
    worldRef.current.sleepMode = p2.World.BODY_SLEEPING
    worldRef.current.solver.iterations = 0.01
    worldRef.current.doProfiling = true;
    


    genericMaterialRef.current = new p2.Material()
    // genericMaterialRef.current.stiffness = 1500;
    // genericMaterialRef.current.relaxation = 3;
    // genericMaterialRef.current.frictionStiffness = 1e8;
    // genericMaterialRef.current.frictionRelaxation = 99999;
    genericMaterialRef.current.friction = 0

    console.log(genericMaterialRef.current)
    

    worldRef.current.addContactMaterial(
      new p2.ContactMaterial(genericMaterialRef.current, genericMaterialRef.current, { restitution: 0.1, stiffness: 11500 })
    )

    worldRef.current.defaultMaterial = genericMaterialRef.current

    async function getCharacters() {
      for (let c of characters) {
        c.shape.material = genericMaterialRef.current
        
        c.body.allowSleep = true
        c.body.sleepSpeedLimit = 1; // Body will feel sleepy if speed < 1
        c.body.sleepTimeLimit = 1; // Body falls asleep after being sleepy for 1s
        c.body.addShape(c.shape)
        worldRef.current.addBody(c.body)
        await delay(200)
      }
    }
    getCharacters();

    return () => {
      // TODO: maybe world clear?
      worldRef.current.clear()
    }

  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // need a wake up on resize, cos floor plane will have moved
    characters.forEach(c => c.body.wakeUp())

    const scaleContextSize = windowWidth <= 768 ? scaleContextLg : scaleContextSm

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const w2 = windowWidth * DPR
    const h2 = (window.innerHeight * 0.75) * DPR
    canvas.width = w2
    canvas.height = h2

    let planeBody
    let mouseConstraint

    worldRef.current.solver.tolerance = 0.001
    worldRef.current.solver.iterations = 4
    // worldRef.current.solver.arrayStep = 1
    
    ctx.lineWidth = 0.03
    ctx.font = '10px Druk'
    
    // Add a plane
    const planeShape = new p2.Plane()

    planeShape.material = genericMaterialRef.current
    // console.log(planeShape.material)
    planeBody = new p2.Body({
      position: [0, (h2 * 0.5 - 50) / scaleContextSize],
      allowSleep: true,
    })
    planeBody.addShape(planeShape)
    worldRef.current.addBody(planeBody)

    // Create a body for the cursor
    const mouseBody = new p2.Body()
    worldRef.current.addBody(mouseBody)


    function drawbox(char, boxBody, boxShape, x, y) {
      
      const tx = boxBody.position[0]
      const ty = boxBody.position[1]

      if (Math.abs(tx) > 10) {
        boxBody.position[0] = randomInRange(-5, 5)
        boxBody.position[1] = 8

        boxBody.velocity[0] = randomInRange(-2, 2)
        boxBody.velocity[1] = randomInRange(0, 2)

        boxBody.angularVelocity = randomInRange(-5, 5)
        
      }

      ctx.strokeStyle = 'pink'
      ctx.save()
      ctx.translate(tx, ty) // Translate to the center of the box
      ctx.rotate(boxBody.angle) // Rotate to the box body frame

      // render hit box
      ctx.rect(
        -boxShape.width / 2,
        -boxShape.height / 2,
        boxShape.width,
        boxShape.height,
      )

      ctx.fillStyle = '#2c2c2c'

      ctx.scale(scaleCharacter, scaleCharacter)
      ctx.rotate(Math.PI)
      // ctx.stroke()
      ctx.fillText(char, x, y)
      ctx.restore()
    }


    const onPointerDown = function (e) {
      // dismiss clicks from right or middle buttons
      const mouseButton = e.button
      if (mouseButton && (mouseButton !== 0 && mouseButton !== 1)) return

      // Convert the canvas coordinate to physics coordinates
      const position = getPhysicsCoord(e, canvas, w2, h2, scaleContextSize)

      // Check if the cursor is inside the box
      const hitBodies = worldRef.current.hitTest(position, characters.map(c => c.body))

      if (hitBodies.length) {
        // Move the mouse body to the cursor position
        mouseBody.position[0] = position[0]
        mouseBody.position[1] = position[1]

        // Create a RevoluteConstraint.
        // This constraint lets the bodies rotate around a common point
        mouseConstraint = new p2.RevoluteConstraint(mouseBody, hitBodies[0], {
          worldPivot: position,
          collideConnected: false
        })
        worldRef.current.addConstraint(mouseConstraint)
      }
    }

    const onMove = function (e) {
      const position = getPhysicsCoord(e.touches ? e.touches[0] : e, canvas, w2, h2, scaleContextSize)
      mouseBody.position[0] = position[0]
      mouseBody.position[1] = position[1]
    }

    const onUp = function () {
      worldRef.current.removeConstraint(mouseConstraint)
      mouseConstraint = null
    }

    document.addEventListener('pointerdown', onPointerDown, { passive: true, capture: false })
    document.addEventListener('mousemove', onMove, { passive: true, capture: false })
    document.addEventListener('touchmove', onMove, { passive: true, capture: false })
    document.addEventListener('mouseup', onUp, { passive: true, capture: false })
    document.addEventListener('touchend', onUp, { passive: true, capture: false })

    function render() {
      // Clear the canvas
      ctx.clearRect(0, 0, w2, h2)

      // Transform the canvas
      ctx.save()
      ctx.translate(w2 * 0.5, h2 * 0.5) // Translate to the center
      ctx.scale(scaleContextSize, scaleContextSize)

      // Draw all bodies
      ctx.beginPath()
      
      characters.forEach(({ character, body, shape, x, y}) => drawbox(character, body, shape, x, y))
      drawPlane(planeBody, ctx, w2)

      ctx.stroke()

      // Restore transform
      ctx.restore()
    }

    function animate() {
      rafRef.current = requestAnimationFrame(animate)
      // Move physics bodies forward in time
      worldRef.current.step(1 / 45)
      render()
    }

    animate()

    return () => {
      window.cancelAnimationFrame(rafRef.current)
      document.removeEventListener('pointerdown', onPointerDown, { passive: true, capture: false })
      document.removeEventListener('mousemove', onMove, { passive: true, capture: false })
      document.removeEventListener('touchmove', onMove, { passive: true, capture: false })
      document.removeEventListener('mouseup', onUp, { passive: true, capture: false })
      document.removeEventListener('touchend', onUp, { passive: true, capture: false })
    }
  }, [windowWidth])

  return (
    <section className={style.section}>
      <canvas
        ref={canvasRef}
        className={style.canvas}
      />
    </section>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<LetterDrop />, rootElement)
