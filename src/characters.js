import p2 from 'p2'

const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

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
  position: [randomInRange(-4, 4), 8],
  angularVelocity: randomInRange(-4, 4),
  allowSleep: true,
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
      position: [randomInRange(-4, 4), 8],
      angularVelocity: randomInRange(-4, 4),
      allowSleep: true,
    })
  },
  {
    character: 'B',
    ...bXY,
    shape: new p2.Box({ ...bBox }),
    body: new p2.Body({ ...bBody }),
  },
  {
    character: 'C',
    ...bXY,
    shape: new p2.Box({ ...bBox }),
    body: new p2.Body({ ...bBody }),
  },
  {
    character: 'D',
    ...bXY,
    shape: new p2.Box({ ...bBox }),
    body: new p2.Body({ ...bBody }),
  },
  {
    character: 'E',
    x: -4.9,
    y: 3.5,
    shape: new p2.Box({
      width: 1.15,
      height: 1,
    }),
    body: new p2.Body({
      mass: 1,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: randomInRange(-4, 4)
    })
  },
  {
    character: 'F',
    x: -4.9,
    y: 3.5,
    shape: new p2.Box({
      width: 1.15,
      height: 1,
    }),
    body: new p2.Body({
      mass: 1,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: randomInRange(-4, 4),
    })
  },
  {
    character: 'G',
    x: -6,
    y: 3.8,
    shape: new p2.Box({
      width: 1.5,
      height: 1,
    }),
    body: new p2.Body({
      mass: 2,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: randomInRange(-4, 4)
    })
  },
  {
    character: 'H',
    x: -6,
    y: 3.5,
    shape: new p2.Box({
      width: 1.5,
      height: 1,
    }),
    body: new p2.Body({
      mass: 2,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: randomInRange(-4, 4),
    })
  },
  {
    character: 'I',
    x: -2,
    y: 3.5,
    shape: new p2.Box({
      width: 0.4,
      height: 1,
    }),
    body: new p2.Body({
      mass: 1,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: 1
    })
  },
  {
    character: 'J',
    x: -4.9,
    y: 3.5,
    shape: new p2.Box({
      width: 1.15,
      height: 1,
    }),
    body: new p2.Body({
      mass: 1,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: randomInRange(-4, 4),
    })
  },
  {
    character: 'K',
    ...bXY,
    shape: new p2.Box({ ...bBox }),
    body: new p2.Body({ ...bBody }),
  },
  {
    character: 'L',
    x: -4.9,
    y: 3.5,
    shape: new p2.Box({
      width: 1.15,
      height: 1,
    }),
    body: new p2.Body({
      mass: 1,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: randomInRange(-4, 4),
    })
  },
  {
    character: 'M',
    x: -6.8,
    y: 3.5,
    shape: new p2.Box({
      width: 1.8,
      height: 1,
    }),
    body: new p2.Body({
      mass: 4,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: 1
    })
  },
  {
    character: 'N',
    ...bXY,
    shape: new p2.Box({ ...bBox }),
    body: new p2.Body({ ...bBody }),
  },
  {
    character: 'O',
    x: -6,
    y: 3.8,
    shape: new p2.Box({
      width: 1.5,
      height: 1,
    }),
    body: new p2.Body({
      mass: 2,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: randomInRange(-4, 4),
    })
  },
  {
    character: 'P',
    ...bXY,
    shape: new p2.Box({ ...bBox }),
    body: new p2.Body({ ...bBody }),
  },
  {
    character: 'Q',
    x: -6,
    y: 3.8,
    shape: new p2.Box({
      width: 1.5,
      height: 1,
    }),
    body: new p2.Body({
      mass: 2,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: randomInRange(-4, 4),
    })
  },
  {
    character: 'R',
    ...bXY,
    shape: new p2.Box({ ...bBox }),
    body: new p2.Body({ ...bBody }),
  },
  {
    character: 'S',
    ...bXY,
    shape: new p2.Box({ ...bBox }),
    body: new p2.Body({ ...bBody }),
  },
  {
    character: 'T',
    x: -4.9,
    y: 3.5,
    shape: new p2.Box({
      width: 1.15,
      height: 1,
    }),
    body: new p2.Body({
      mass: 1,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: randomInRange(-4, 4),
    })
  },
  {
    character: 'U',
    x: -6,
    y: 3.5,
    shape: new p2.Box({
      width: 1.5,
      height: 1,
    }),
    body: new p2.Body({
      mass: 2,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: randomInRange(-4, 4),
    })
  },
  {
    character: 'V',
    x: -6,
    y: 3.5,
    shape: new p2.Box({
      width: 1.5,
      height: 1,
    }),
    body: new p2.Body({
      mass: 2,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: randomInRange(-4, 4),
    })
  },
  {
    character: 'W',
    x: -8.1,
    y: 3.5,
    shape: new p2.Box({
      width: 2.2,
      height: 1,
    }),
    body: new p2.Body({
      mass: 5,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: -2
    })
  },
  
  {
    character: 'X',
    x: -6,
    y: 3.5,
    shape: new p2.Box({
      width: 1.5,
      height: 1,
    }),
    body: new p2.Body({
      mass: 2,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: randomInRange(-4, 4),
    })
  },
  {
    character: 'Y',
    x: -6,
    y: 3.5,
    shape: new p2.Box({
      width: 1.5,
      height: 1,
    }),
    body: new p2.Body({
      mass: 2,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: randomInRange(-4, 4),
    })
  },
  {
    character: 'Z',
    x: -4.9,
    y: 3.5,
    shape: new p2.Box({
      width: 1.15,
      height: 1,
    }),
    body: new p2.Body({
      mass: 1,
      position: [randomInRange(-4, 4), 8],
      angularVelocity: randomInRange(-4, 4),
    })
  },
  
  
  
]