const data = [[1, 6, 3, 4, 0],
              [2, 5, 3, 4, 1],
              [3, 4, 3, 4, 2],
              [4, 3, 3, 4, 3],
              [5, 2, 3, 4, 4],
              [6, 1, 3, 4, 5]]

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
    series: [{name: 'BT', points: BT_points},
             {name: 'BP', points: BP_points}]
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
