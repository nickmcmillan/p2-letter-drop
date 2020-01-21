import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import p2 from 'p2'

import './styles.css'

const characters = [
  {
    character : 'M',
    width: 1.8,
    height: 1,
    x: 6.8,
    y: 3.5,
  }
]

function App() {
  const myRef = useRef(null)

  useEffect(() => {

    const canvas = myRef.current
    const ctx = canvas.getContext('2d')
    const w = canvas.width;
    const h = canvas.height;

    let boxBody
    let planeBody
    let mouseConstraint
    let mouseBody

    const scaleX = 50
    const scaleY = -50
    let boxShape
    let planeShape

    const world = new p2.World({
      gravity: [0, -9.82]
    });

    init();
    animate();

    function init() {

      ctx.lineWidth = 0.05;
      ctx.font = '10px Druk';

      characters.forEach(c => {
        
      })

      // Add a box
      boxShape = new p2.Box({ 
        width: 1.8,
        height: 1,
      })

      boxBody = new p2.Body({
        mass: 1,
        position: [0, 3],
        angularVelocity: 1
      })

      boxBody.addShape(boxShape);
      world.addBody(boxBody);

      // Add a plane
      planeShape = new p2.Plane();
      planeBody = new p2.Body();
      planeBody.addShape(planeShape);
      world.addBody(planeBody);

      // Create a body for the cursor
      mouseBody = new p2.Body();
      world.addBody(mouseBody);

      canvas.addEventListener('mousedown', function (event) {

        // Convert the canvas coordinate to physics coordinates
        const position = getPhysicsCoord(event);

        // Check if the cursor is inside the box
        const hitBodies = world.hitTest(position, [boxBody]);

        if (hitBodies.length) {
          // Move the mouse body to the cursor position
          mouseBody.position[0] = position[0];
          mouseBody.position[1] = position[1];

          // Create a RevoluteConstraint.
          // This constraint lets the bodies rotate around a common point
          mouseConstraint = new p2.RevoluteConstraint(mouseBody, boxBody, {
            worldPivot: position,
            collideConnected: false
          });
          world.addConstraint(mouseConstraint);
        }
      });

      // Sync the mouse body to be at the cursor position
      canvas.addEventListener('mousemove', function (event) {
        const position = getPhysicsCoord(event);
        mouseBody.position[0] = position[0];
        mouseBody.position[1] = position[1];
      });

      // Remove the mouse constraint on mouse up
      canvas.addEventListener('mouseup', function (event) {
        world.removeConstraint(mouseConstraint);
        mouseConstraint = null;
      });
    }

    // Convert a canvas coordiante to physics coordinate
    function getPhysicsCoord(mouseEvent) {
      const rect = canvas.getBoundingClientRect();
      let x = mouseEvent.clientX - rect.left;
      let y = mouseEvent.clientY - rect.top;

      x = (x - w / 2) / scaleX;
      y = (y - h / 2) / scaleY;

      return [x, y];
    }

    function drawbox({ char, x, y }) {
      ctx.beginPath()

      const x = boxBody.position[0]
      const y = boxBody.position[1]

      ctx.strokeStyle = 'pink'
      ctx.save()
      ctx.translate(x, y) // Translate to the center of the box
      ctx.rotate(boxBody.angle) // Rotate to the box body frame
      ctx.rect(
        -boxShape.width / 2,
        -boxShape.height / 2,
        boxShape.width,
        boxShape.height,
      )

      ctx.fillStyle = '#2c2c2c'

      ctx.scale(0.1333, 0.1333)
      ctx.rotate(Math.PI)
      ctx.fillText('M', -6.8, 3.5);
      ctx.restore()
    }

    function drawPlane() {
      const y = planeBody.position[1]
      ctx.moveTo(-w, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    function render() {
      // Clear the canvas
      ctx.clearRect(0, 0, w, h);

      // Transform the canvas
      ctx.save();
      ctx.translate(w / 2, h / 2); // Translate to the center
      ctx.scale(scaleX, scaleY);

      // Draw all bodies
      drawbox();
      drawPlane();

      // Restore transform
      ctx.restore();
    }

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Move physics bodies forward in time
      world.step(1 / 60);

      // Render scene
      render();
    }
  }, [])

  return (
    <div className="App">
      <canvas width="600" height="400" ref={myRef} />
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
