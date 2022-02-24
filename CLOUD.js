const CLOUD = new Object(null)

CLOUD.PARAM = {'video' : [36, 16, 17, 27, 18, 23,  9,  7,  6, 24,
               34, 22, 30, 12, 29, 15, 38,  3,  8, 37,
               39, 40,  1, 32, 33, 25,  2, 31, 10,  5,
               11, 35,  0, 28, 20, 19, 14, 26, 13,  4,
               21, 41],
               'audio' : [13, 9, 0, 14, 1,  5, 7,  6, 8,
               2, 11, 3, 10, 4, 12]
}

CLOUD.MILA_MEAN_SD = [[37, 1], //BT
                      [112, 30], //BP
                      [80, 30], //HR
                      [14, 10]] //RR

CLOUD.NO_RISK = -2

const MILA_PARAM = {CARDIOVASCULAR:   {weight: [ 0,  1,  1,  0,    1, CLOUD.NO_RISK], power: [1, 1, 1, 1]}, //BT, BP, HR, RR, Age, C
                    DERMATOLOGY:      {weight: [ 1,  0,  0,  0,    1, CLOUD.NO_RISK], power: [2, 1, 1, 1]},
                    INFECTION:        {weight: [ 1,  0,  0,  1,    1, CLOUD.NO_RISK], power: [1, 1, 1, 1]},
                    RESPIRATORY:      {weight: [ 0,  0,  0,  1,    1, CLOUD.NO_RISK], power: [1, 1, 1, 2]},
                    METABOLIC:        {weight: [ 1,  0,  1,  0,    1, CLOUD.NO_RISK], power: [1, 1, 1, 1]},
                    GASTROINTESTINAL: {weight: [-1,  0,  0,  1,    1, CLOUD.NO_RISK], power: [1, 1, 1, 1]}}

const UPDATE_PARAM = function(NEW_PARAM, pop_size) {
    const split = pop_size - NEW_PARAM.length
    const new_weights = NEW_PARAM
    for (const model in NEW_PARAM) {
        NEW_PARAM.forEach(param => {
            new_weights[model].weight[0] = new_weights[model].weight[0]
        })
    }
}

CLOUD.GET_MILA_PARAM = function() {
    return MILA_PARAM
}

CLOUD.SEARCH_NEW_PARAM = function(people) {
    const NEW_PARAM = new Array()
    people.forEach(person => {
        if (person.phone.NEW_PARAM > 1000) {
            NEW_PARAM.push(person.phone.drive.MILA_PARAM)
        }
    })
    if (NEW_PARAM.length > 0) {
        UPDATE_PARAM(NEW_PARAM, people.length)
    }
}

export default Object.freeze(CLOUD)