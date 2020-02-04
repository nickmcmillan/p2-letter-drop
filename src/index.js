import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import p2 from 'p2'
import { useWindowWidth } from '@react-hook/window-size'
import delay from 'delay'
import DatGui, { DatNumber, DatBoolean } from '@tim-soft/react-dat-gui'
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
  const worldRef = useRef()

  const windowWidth = useWindowWidth(ssrWidth, {
    wait: 1500,
    leading: false,
  })

  const DPR = window.devicePixelRatio || 1


  const [datGuiData, setDatGuiData] = useState({
    gravity: -9.82,
    relaxation: 4,
    stiffness: 2500,
    showHitboxes: false,
  })

  const handleUpdate = newData => setDatGuiData(newData)

  const {
    gravity,
    relaxation,
    stiffness,
    showHitboxes,
  } = datGuiData

  function drawPlane(planeBody, ctx, w2) {
    const y = planeBody.position[1]
    ctx.moveTo(-w2, y)
    ctx.lineTo(w2, y)
  }


  // world set up, strictly run only once
  useEffect(() => {
    worldRef.current = new p2.World({
      islandSplit: true,
      // Defaults to SAPBroadphase
    })
    worldRef.current.solver.iterations = 0.1
    worldRef.current.solver.tolerance = 0.001

    console.log(worldRef.current)

    const genericMaterial = new p2.Material()
    const contactMaterial = new p2.ContactMaterial(genericMaterial, genericMaterial)

    worldRef.current.defaultMaterial = genericMaterial
    worldRef.current.addContactMaterial(contactMaterial)

    // https://github.com/schteppe/p2.js/issues/251
    worldRef.current.sleepMode = p2.World.BODY_SLEEPING

    // letter set up
    async function addLetters() {
      for (let c of characters) {
        await delay(200)
        c.shape.material = genericMaterial

        c.body.allowSleep = true
        c.fillStyle = Math.random() > 0.25 ? '#2c2c2c' : '#ddd' // random colour split
        c.body.sleepSpeedLimit = 0.5 // Body will feel sleepy if speed < x
        c.body.sleepTimeLimit = 2 // Body falls asleep after being sleepy for x secondss
        c.body.addShape(c.shape)
        worldRef.current.addBody(c.body)
      }
    }

    addLetters()

    return () => {
      // TODO: maybe world clear?
      worldRef.current.clear()
    }
  }, [])

  // dat gui mods
  useEffect(() => {
    worldRef.current.gravity = [0, gravity]
    worldRef.current.setGlobalStiffness(stiffness)
    worldRef.current.setGlobalRelaxation(relaxation)
  }, [relaxation, stiffness, gravity])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // need a wake up on resize, cos floor plane will have moved
    worldRef.current.bodies.forEach(b => b.wakeUp())

    const scaleContextSize = windowWidth <= 768 ? scaleContextLg : scaleContextSm

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const w2 = windowWidth * DPR
    const h2 = (window.innerHeight * 0.75) * DPR
    canvas.width = w2
    canvas.height = h2

    let planeBody
    let mouseConstraint

    ctx.lineWidth = 0.03
    ctx.font = '10px Druk'
    
    // Add a plane
    const planeShape = new p2.Plane()

    planeBody = new p2.Body({
      position: [0, (h2 * 0.5 - 50) / scaleContextSize],
      allowSleep: true,
    })
    planeBody.addShape(planeShape)
    worldRef.current.addBody(planeBody)

    // Create a body for the cursor
    const mouseBody = new p2.Body()
    worldRef.current.addBody(mouseBody)


    // Convert a canvas coordiante to physics coordinate
    function getPhysicsCoord(e, canvas, w2, h2, scaleContextSize) {
      const rect = canvas.getBoundingClientRect()
      let x = (e.clientX - rect.left) * DPR
      let y = (e.clientY - rect.top) * DPR

      x = (x - w2 * 0.5) / scaleContextSize
      y = (y - h2 * 0.5) / scaleContextSize

      return [x, y]
    }


    function drawbox(char, boxBody, boxShape, x, y, fillStyle) {
      
      const tx = boxBody.position[0]
      const ty = boxBody.position[1]

      // reset boxBody if out of bounds
      if (Math.abs(tx) > 10) {
        boxBody.position[0] = randomInRange(-5, 5)
        boxBody.position[1] = 8
        boxBody.velocity[0] = randomInRange(-2, 2)
        boxBody.velocity[1] = randomInRange(0, 2)
        boxBody.angularVelocity = randomInRange(-5, 5)
      }

      
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

      ctx.fillStyle = fillStyle

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

      // Check if the cursor is inside a body
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
      
      characters.forEach(({ character, body, shape, x, y, fillStyle }) => drawbox(character, body, shape, x, y, fillStyle))
      drawPlane(planeBody, ctx, w2)


      if (showHitboxes) {
        ctx.strokeStyle = 'blue'
        ctx.stroke()
      }

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
  }, [windowWidth, DPR, showHitboxes])

  return (
    <section className={style.section}>
      <canvas
        ref={canvasRef}
        className={style.canvas}
      />

      <DatGui
        onUpdate={handleUpdate}
        data={datGuiData}
        style={{
          position: 'absolute',
          bottom: '0',
          top: 'inherit',
        }}
      >
        <DatNumber path='gravity' label='gravity' min={-20} max={4} step={0.01} />
        <DatNumber path='relaxation' label='relaxation' min={0.05} max={4} step={0.01} />
        <DatNumber path='stiffness' label='stiffness' min={20} max={5000} step={1} />
        <DatBoolean path='showHitboxes' label='showHitboxes' />
        

      </DatGui>
    </section>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<LetterDrop />, rootElement)
