import CCTV from "./CCTV.js"
import CLOUD from "./CLOUD.js"
import Person from "./person.js"
import * as m from './maths.js'
import sensorFn from "./sensorFn.js"

const intance = 60
const day = 1440
const duration = day * 30

MILA_SIMULATION(1)

function MILA_SIMULATION(population_size, active_devices) {
  const population = new Array()
  for (let i = 0; i < population_size; i++) {population.push(new Person())}

  console.log(population[0].vitals)

  for (let s = 0; s < 10; s++) {
    for (let i = 0; i < 500; i++) {
      population[0].phone.drive.video.push(sensorFn.FRAME([population[0].appearance('video', s)], 10))
      population[0].phone.drive.audio.push(sensorFn.FRAME([population[0].appearance('audio', s)], 10))
    }
  }

  for (let i = 0; i < 50000; i++) {
    population[0].phone.PROCESS_DATA()
  }

  population[0].phone.PROCESS_VITALS(1)

  population[0].vitals = [10,20,30,40]

  for (let s = 0; s < 10; s++) {
    for (let i = 0; i < 500; i++) {
      population[0].phone.drive.video.push(sensorFn.FRAME([population[0].appearance('video', s)], 10))
      population[0].phone.drive.audio.push(sensorFn.FRAME([population[0].appearance('audio', s)], 10))
    }
  }

  for (let i = 0; i < 5000; i++) {
    population[0].phone.PROCESS_DATA()
  }

  population[0].phone.PROCESS_VITALS(2)
  console.log(population[0].phone.drive.vitals)
}
