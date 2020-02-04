import p2 from 'p2'

const bXY = {
  x: -5.9,
  y: 3.5,
}

const bBox = {
  width: 1.4,
  height: 1,
}

const bBody = {
  mass: 3,
  position: [-2, 4],
  angularVelocity: -1
}

export default [
  {
    character: 'A',
    x: -6,
    y: 3.5,
    shape: new p2.Box({
      width: 1.5,
      height: 1,
    }),
    body: new p2.Body({
      mass: 2,
      position: [-1, 5],
      angularVelocity: -1,
      allowSleep: true,
    })
  },
  // {
  //   character: 'B',
  //   ...bXY,
  //   shape: new p2.Box({ ...bBox }),
  //   body: new p2.Body({ ...bBody }),
  // },
  // {
  //   character: 'C',
  //   ...bXY,
  //   shape: new p2.Box({ ...bBox }),
  //   body: new p2.Body({ ...bBody }),
  // },
  // {
  //   character: 'D',
  //   ...bXY,
  //   shape: new p2.Box({ ...bBox }),
  //   body: new p2.Body({ ...bBody }),
  // },
  // {
  //   character: 'E',
  //   x: -4.9,
  //   y: 3.5,
  //   shape: new p2.Box({
  //     width: 1.15,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 1,
  //     position: [-2, 4],
  //     angularVelocity: -1
  //   })
  // },
  // {
  //   character: 'F',
  //   x: -4.9,
  //   y: 3.5,
  //   shape: new p2.Box({
  //     width: 1.15,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 1,
  //     position: [-2, 4],
  //     angularVelocity: -1
  //   })
  // },
  // {
  //   character: 'G',
  //   x: -6,
  //   y: 3.8,
  //   shape: new p2.Box({
  //     width: 1.5,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 2,
  //     position: [-5, 3],
  //     angularVelocity: -1
  //   })
  // },
  // {
  //   character: 'H',
  //   x: -6,
  //   y: 3.5,
  //   shape: new p2.Box({
  //     width: 1.5,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 2,
  //     position: [-1, 5],
  //     angularVelocity: -1
  //   })
  // },
  // {
  //   character: 'I',
  //   x: -2,
  //   y: 3.5,
  //   shape: new p2.Box({
  //     width: 0.4,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 1,
  //     position: [1, 1],
  //     angularVelocity: 1
  //   })
  // },
  // {
  //   character: 'J',
  //   x: -4.9,
  //   y: 3.5,
  //   shape: new p2.Box({
  //     width: 1.15,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 1,
  //     position: [-2, 4],
  //     angularVelocity: -1
  //   })
  // },
  // {
  //   character: 'K',
  //   ...bXY,
  //   shape: new p2.Box({ ...bBox }),
  //   body: new p2.Body({ ...bBody }),
  // },
  // {
  //   character: 'L',
  //   x: -4.9,
  //   y: 3.5,
  //   shape: new p2.Box({
  //     width: 1.15,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 1,
  //     position: [-2, 4],
  //     angularVelocity: -1
  //   })
  // },
  // {
  //   character: 'M',
  //   x: -6.8,
  //   y: 3.5,
  //   shape: new p2.Box({
  //     width: 1.8,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 4,
  //     position: [0, 3],
  //     angularVelocity: 1
  //   })
  // },
  // {
  //   character: 'N',
  //   ...bXY,
  //   shape: new p2.Box({ ...bBox }),
  //   body: new p2.Body({ ...bBody }),
  // },
  // {
  //   character: 'O',
  //   x: -6,
  //   y: 3.8,
  //   shape: new p2.Box({
  //     width: 1.5,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 2,
  //     position: [-5, 3],
  //     angularVelocity: -1
  //   })
  // },
  // {
  //   character: 'P',
  //   ...bXY,
  //   shape: new p2.Box({ ...bBox }),
  //   body: new p2.Body({ ...bBody }),
  // },
  // {
  //   character: 'Q',
  //   x: -6,
  //   y: 3.8,
  //   shape: new p2.Box({
  //     width: 1.5,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 2,
  //     position: [-5, 3],
  //     angularVelocity: -1
  //   })
  // },
  // {
  //   character: 'R',
  //   ...bXY,
  //   shape: new p2.Box({ ...bBox }),
  //   body: new p2.Body({ ...bBody }),
  // },
  // {
  //   character: 'S',
  //   ...bXY,
  //   shape: new p2.Box({ ...bBox }),
  //   body: new p2.Body({ ...bBody }),
  // },
  // {
  //   character: 'T',
  //   x: -4.9,
  //   y: 3.5,
  //   shape: new p2.Box({
  //     width: 1.15,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 1,
  //     position: [-2, 9],
  //     angularVelocity: -1
  //   })
  // },
  // {
  //   character: 'U',
  //   x: -6,
  //   y: 3.5,
  //   shape: new p2.Box({
  //     width: 1.5,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 2,
  //     position: [-1, 5],
  //     angularVelocity: -1
  //   })
  // },
  // {
  //   character: 'V',
  //   x: -6,
  //   y: 3.5,
  //   shape: new p2.Box({
  //     width: 1.5,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 2,
  //     position: [-1, 5],
  //     angularVelocity: -1
  //   })
  // },
  // {
  //   character: 'W',
  //   x: -8.1,
  //   y: 3.5,
  //   shape: new p2.Box({
  //     width: 2.2,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 5,
  //     position: [0, 3],
  //     angularVelocity: -2
  //   })
  // },
  
  // {
  //   character: 'X',
  //   x: -6,
  //   y: 3.5,
  //   shape: new p2.Box({
  //     width: 1.5,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 2,
  //     position: [-1, 5],
  //     angularVelocity: -1
  //   })
  // },
  // {
  //   character: 'Y',
  //   x: -6,
  //   y: 3.5,
  //   shape: new p2.Box({
  //     width: 1.5,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 2,
  //     position: [-1, 5],
  //     angularVelocity: -1
  //   })
  // },
  // {
  //   character: 'Z',
  //   x: -4.9,
  //   y: 3.5,
  //   shape: new p2.Box({
  //     width: 1.15,
  //     height: 1,
  //   }),
  //   body: new p2.Body({
  //     mass: 1,
  //     position: [-2, 4],
  //     angularVelocity: -1
  //   })
  // },
  
  
  
]