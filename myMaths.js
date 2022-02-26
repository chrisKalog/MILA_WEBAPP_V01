export function roundDP(number, DP){
    return (Math.round(number * (10**DP)) / (10**DP))
}

export function sf(number, sf) {
  const DP = sf - (Math.round(Math.log10(Math.round(number))) + 1)
  if ((DP**2) === Infinity) {DP = sf}
  return (Math.round(number * (10**DP)) / (10**DP))
}

export function randomNumberBetween(min, max) {
    return Math.random() * (max - min) + min
}

export function gaussian(mean, stdev) {
  let y2;
  let use_last = false;
  let y1;
  if (use_last) {
      y1 = y2;
      use_last = false;
  } else {
      let x1, x2, w;
      do {
          x1 = 2.0 * Math.random() - 1.0;
          x2 = 2.0 * Math.random() - 1.0;
          w = x1 * x1 + x2 * x2;
      } while (w >= 1.0);
      w = Math.sqrt((-2.0 * Math.log(w)) / w);
      y1 = x1 * w;
      y2 = x2 * w;
      use_last = true;
  }

  let retval = mean + stdev * y1;
  return retval;
}

export function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function mul(a, b) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);  // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (var c = 0; c < bNumCols; ++c) {
        m[r][c] = 0;             // initialize the current cell
        for (var i = 0; i < aNumCols; ++i) {
            m[r][c] += a[r][i] * b[i][c];
        }
        }
    }
    return m;
}

export function invs(m) {
    const det = m[0][0]*m[1][1] - m[0][1]*m[1][0]

    let inv_m = [[],[]]

    inv_m[0][0] = m[1][1] / det
    inv_m[1][1] = m[0][0] / det
    inv_m[0][1] = -m[0][1] / det
    inv_m[1][0] = -m[1][0] / det

    return(inv_m)
}

export function mul2(a, b) {
    const len = b.length
    const c = [0, 0]

    for (let j = 0; j < 2; j++) {
        b.forEach((e, i) => {
            c[j] += e * a[j][i]
        })
    }

    return c
}


export function tran(matrix) {
    return matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c]));
  }
