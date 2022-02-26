import CCTV from "./CCTV.js"
import CLOUD from "./CLOUD.js"
import Person from "./person.js"
import * as m from './myMaths.js'
import sensorFn from "./sensorFn.js"

const init_POPULATION = function(population_size) {
    const output = new Array()
    for (let i = 0; i < population_size; i++) {output.push(new Person())}
    return output
}

const instance = 120
const day_instannces = 720
const num_days = 30

const data = MILA_SIMULATION(1)

const BT_points = new Array()
const BP_points = new Array()
const HR_points = new Array()
const RR_points = new Array()

data.forEach((point, idx) => {
    BT_points[idx] = {x: point[4], y: point[0]}
    BP_points[idx] = {x: point[4], y: point[1]}
    HR_points[idx] = {x: point[4], y: point[2]}
    RR_points[idx] = {x: point[4], y: point[3]}
})

JSC.Chart('chartBT', {
    series: [{name: 'BT', points: BT_points}]
});
JSC.Chart('chartBP', {
    series: [{name: 'BP', points: BP_points}]
});
JSC.Chart('chartHR', {
    series: [{name: 'HR', points: HR_points}]
});
JSC.Chart('chartRR', {
    series: [{name: 'RR', points: RR_points}]
});

export function MILA_SIMULATION(population_size, active_devices) {
    const population = init_POPULATION(population_size)
    console.log(population[0].vitals)

    for (let day = 0; day < num_days; day++) {
        const record_num = 10

        for (let i = 0; i < record_num; i++) {
            const num_frame = 300
            const situ = Math.round(Math.random()*50)

            for (let j = 0; j < num_frame; j++) {
                population[0].phone.drive.video.push(sensorFn.FRAME([population[0].appearance('video', situ)], 50))
                population[0].phone.drive.video.push(sensorFn.FRAME([population[0].appearance('audio', situ)], 50))
            }
        }

        for (let i = 0; i < 600; i++) {
            population[0].phone.PROCESS_DATA()
        }

        population[0].phone.PROCESS_VITALS(day)

        if (day == 15) {
            population[0].vitals[1] = population[0].vitals[1] * 0.9
            population[0].vitals[3] = population[0].vitals[3] * 1.1
        }
    }

    console.log(population[0].phone.drive.vitals)
    console.log(population[0].vitals)
    return population[0].phone.drive.vitals
}
