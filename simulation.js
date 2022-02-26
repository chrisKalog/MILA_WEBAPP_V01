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

const instance =      60
const day_instances = 1440
const num_days =      60
const ra_span =       10
const rg_span =       10
const vpd =           1

const title = document.getElementById("title")
title.innerText = vpd + "/DAY  |  SPAN: [" + String([ra_span, rg_span]) +"]  |  " + num_days + " DAYS"

const warm_up = ((ra_span + 2)/ vpd) + (1 / vpd) * rg_span
const run_time = day_instances * num_days

const scene1 = MILA_SIMULATION(1, vpd)
const data1 = scene1.vitals
const data1_ra = scene1.vital_trend
const mt = scene1.month_trend

const t1 = scene1.trend_track_STND

const t = [t1]

const data = [data1, data1_ra]

const BT_points = new Array(data.length)
const BP_points = new Array(data.length)
const HR_points = new Array(data.length)
const RR_points = new Array(data.length)

const BT_Gpoints = new Array(t.length)
const BP_Gpoints = new Array(t.length)
const HR_Gpoints = new Array(t.length)
const RR_Gpoints = new Array(t.length)

data.forEach((e,i) => {
    BT_points[i] = []
    BP_points[i] = []
    HR_points[i] = []
    RR_points[i] = []
})
t.forEach((e,i) => {
    BT_Gpoints[i] = []
    BP_Gpoints[i] = []
    HR_Gpoints[i] = []
    RR_Gpoints[i] = []
})

const BT_series = new Array(data.length)
const BP_series = new Array(data.length)
const HR_series = new Array(data.length)
const RR_series = new Array(data.length)

let BT_Gseries = new Array(data.length)
let BP_Gseries = new Array(data.length)
let HR_Gseries = new Array(data.length)
let RR_Gseries = new Array(data.length)

for (let i = 0; i < data.length; i++) {
    data[i].forEach((point, idx) => {
        BT_points[i][idx] = {x: point[4], y: point[0]}
        BP_points[i][idx] = {x: point[4], y: point[1]}
        HR_points[i][idx] = {x: point[4], y: point[2]}
        RR_points[i][idx] = {x: point[4], y: point[3]}
    })
    BT_series[i] = {name: ('BT' + i), points: BT_points[i]}
    BP_series[i] = {name: ('BP' + i), points: BP_points[i]}
    HR_series[i] = {name: ('HR' + i), points: HR_points[i]}
    RR_series[i] = {name: ('RR' + i), points: RR_points[i]}
}

t1.forEach((point, idx) => {
    BT_Gpoints[idx] = {x: point[4], y: point[0]}
    BP_Gpoints[idx] = {x: point[4], y: point[1]}
    HR_Gpoints[idx] = {x: point[4], y: point[2]}
    RR_Gpoints[idx] = {x: point[4], y: point[3]}
})
BT_Gseries = [{name: 'BT_Grad', points: BT_Gpoints}]
BP_Gseries = [{name: 'BP_Grad', points: BP_Gpoints}]
HR_Gseries = [{name: 'HR_Grad', points: HR_Gpoints}]
RR_Gseries = [{name: 'RR_Grad', points: RR_Gpoints}]

const rgrss_points = [[],[],[],[]]
console.log(scene1.month_trend_STND)

for (let i = 0; i < 4; i++) {
    rgrss_points[i][0] = {x: mt[0][5], y: (mt[0][i][0] * mt[0][5] + mt[0][i][1])}
    rgrss_points[i][1] = {x: mt[0][4], y: (mt[0][i][0] * mt[0][4] + mt[0][i][1])}
}

BT_series.push({name: 'BT_Trend', points: rgrss_points[0]})
BP_series.push({name: 'BT_Trend', points: rgrss_points[1]})
HR_series.push({name: 'BT_Trend', points: rgrss_points[2]})
RR_series.push({name: 'BT_Trend', points: rgrss_points[3]})

JSC.Chart('chartBT', {
    series: BT_series
});
JSC.Chart('gradBT', {
    series: BT_Gseries
});
JSC.Chart('chartBP', {
    series: BP_series
});
JSC.Chart('gradBP', {
    series: BP_Gseries
});
JSC.Chart('chartHR', {
    series: HR_series
});
JSC.Chart('gradHR', {
    series: HR_Gseries
});
JSC.Chart('chartRR', {
    series: RR_series
});
JSC.Chart('gradRR', {
    series: RR_Gseries
});

//RUN    NUR\\    //RUN    NUR\\    //RUN    NUR\\    //RUN    NUR\\    //RUN    NUR\\    //RUN    NUR\\    //RUN    NUR\\

export function MILA_SIMULATION(population_size, vpd) {
    const population = init_POPULATION(population_size)
    population[0].vitals = [CLOUD.MEAN_SD[0][0], CLOUD.MEAN_SD[1][0], CLOUD.MEAN_SD[2][0], CLOUD.MEAN_SD[3][0]]

    const video_per_day = vpd //NOT 7 OR 11!
    let day = 0

    for (let time = 1; time <= run_time; time++) {
        if (time == 30 * day_instances) {
            // population[0].vitals[0] = CLOUD.MEAN_SD[0][0] + CLOUD.MEAN_SD[0][1]
            // population[0].vitals[1] = CLOUD.MEAN_SD[1][0] - CLOUD.MEAN_SD[1][1]
            // population[0].vitals[2] = CLOUD.MEAN_SD[2][0] + CLOUD.MEAN_SD[2][1]
            // population[0].vitals[3] = CLOUD.MEAN_SD[3][0] - CLOUD.MEAN_SD[3][1]
            population[0].QUICK_CONDITION()
        }

        if (time % (day_instances/video_per_day) == 0) {
            const situ = Math.random()

            for (let frame = 0; frame < (instance*10); frame++) {
                population.forEach(person => {
                    person.phone.drive.video.push(sensorFn.FRAME([person.appearance('video', situ)], 100))
                    person.phone.drive.audio.push(sensorFn.FRAME([person.appearance('audio', situ)], 100))
                })
            }
        }

        population.forEach(person => {
            for (let i = 0; i < (instance / 10); i++) {
                person.phone.PROCESS_DATA()
            }
        })

        if (time % day_instances == 0) {
            population.forEach(person => {
                person.phone.PROCESS_VITALS(day)
                person.phone.ROLLING_AVERAGE(day, ra_span)
                person.phone.DETECT_TREND(day, rg_span)
            })
            console.log(day)
            day ++
        }
    }
    population.forEach(person => {
        person.phone.MONTHLY_TREND(day, 60)
    })

    return population[0].phone.drive
}
