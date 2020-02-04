import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import p2 from 'p2'
import useDimensions from './useDimensions'
import { useWindowWidth } from '@react-hook/window-size'
import delay from 'delay'
import style from './styles.module.css'

import characters from './characters'

function mapRange (value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const contextScale = 0.133

const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;



function App() {
  
  const [ref, { width, height }] = useDimensions()
  const canvasRef = useRef()
  const rafRef = useRef()

  // const windowWidth = useWindowWidth(ssrWidth, {
  //   wait: 1000,
  //   leading: false,
  // })

  const DPR = window.devicePixelRatio || 1

  const worldRef = useRef()
  const genericMaterialRef = useRef()

  // world and character set up, runs only once.
  useEffect(() => {
    worldRef.current = new p2.World({
      // gravity: [0, -9.82],
      gravity: [0, -10],
      islandSplit: true,
      sleepMode: p2.World.BODY_SLEEPING,
      // Defaults to SAPBroadphase
    })

    genericMaterialRef.current = new p2.Material()
    worldRef.current.addContactMaterial(
      new p2.ContactMaterial(genericMaterialRef.current, genericMaterialRef.current, { restitution: 0.2, stiffness: 1000 })
    )

    async function getCharacters() {
      for (let c of characters) {
        c.shape.material = genericMaterialRef.current
        c.body.addShape(c.shape)
        worldRef.current.addBody(c.body)
        await delay(200)
      }
    }
    getCharacters();

  }, [])

  useEffect(() => {
    if (!width || !height) return
    if (typeof window === 'undefined') return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const w = width;
    const h = height;

    const w2 = width * DPR;
    const h2 = height * DPR;
    canvas.width = w2;
    canvas.height = h2;

    let planeBody
    let mouseConstraint

    const scale = -200

    worldRef.current.solver.tolerance = 0.001
    worldRef.current.solver.iterations = 1;
    // worldRef.current.solver.arrayStep = 1;
    
    ctx.lineWidth = 0.03;
    ctx.font = '10px Druk';
    
    // Add a plane
    const planeShape = new p2.Plane()

    planeShape.material = genericMaterialRef.current
    // console.log(planeShape.material)
    planeBody = new p2.Body({
      position: [0, (h - 50) / scale],
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

        boxBody.angularVelocity = randomInRange(-2, 2)
        
      }

      ctx.strokeStyle = 'pink'
      ctx.save()
      ctx.translate(tx, ty) // Translate to the center of the box
      ctx.rotate(boxBody.angle) // Rotate to the box body frame

      // render hit box
      // ctx.rect(
      //   -boxShape.width / 2,
      //   -boxShape.height / 2,
      //   boxShape.width,
      //   boxShape.height,
      // )

      ctx.fillStyle = '#2c2c2c'

      ctx.scale(contextScale, contextScale)
      // ctx.rotate(Math.PI)
      // ctx.stroke()
      ctx.fillText(char, x, y)
      ctx.restore()
    }

    function drawPlane() {
      const y = planeBody.position[1]
      ctx.moveTo(-w, y)
      ctx.lineTo(w, y)
    }


    // Convert a canvas coordiante to physics coordinate
    function getPhysicsCoord(e, canvas) {
      const rect = canvas.getBoundingClientRect();
      let x = (e.clientX - rect.left) * DPR;
      let y = (e.clientY - rect.top) * DPR;

      x = (x - w2 / 2) / scale;
      y = (y - h2 / 2) / scale;

      return [x, y];
    }


    const onPointerDown = function (e) {
      // dismiss clicks from right or middle buttons
      const mouseButton = e.button
      if (mouseButton && (mouseButton !== 0 && mouseButton !== 1)) return

      // Convert the canvas coordinate to physics coordinates
      const position = getPhysicsCoord(e, canvas)

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
      const position = getPhysicsCoord(e.touches ? e.touches[0] : e, canvas)
      mouseBody.position[0] = position[0]
      mouseBody.position[1] = position[1]
    }

    const onUp = function (e) {
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
      ctx.clearRect(0, 0, w2, h2);

      // Transform the canvas
      ctx.save();
      ctx.translate(w2 / 2, h2 / 2); // Translate to the center
      ctx.scale(scale, scale);

      // Draw all bodies
      ctx.beginPath()
      
      characters.forEach(({ character, body, shape, x, y}) => {
        drawbox(character, body, shape, x, y)
      })

      drawPlane();

      ctx.stroke()

      // Restore transform
      ctx.restore();
    }

    function animate() {
      rafRef.current = requestAnimationFrame(animate);
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
  }, [width])

  return (
    <section className={style.section} ref={ref}>
      <canvas
        ref={canvasRef}
        className={style.canvas}
      />
    </section>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
