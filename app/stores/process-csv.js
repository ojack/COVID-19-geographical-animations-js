const csv = require('csv-parse/lib/sync')

module.exports = (data) => {
  const parsed = csv(data)
  const header = parsed[0]
  const body = parsed.slice(1)

  const stateIndex = header.indexOf('Province/State')
  const countryIndex = header.indexOf('Country/Region')
  const latIndex = header.indexOf('Lat')
  const longIndex = header.indexOf('Long')
  const timeseriesStart = header.indexOf("1/22/20")

  const regions = {}
  body.forEach((row) => {
    const country = row[countryIndex]
    const state = row[stateIndex]
    const key = `${country}${state.length > 0? `-${state}`: ''}`
    const totalcases = row.slice(timeseriesStart).map((val) => parseFloat(val))
    const newcases = dailyNewCases(totalcases)
    const maxnewcases = maxNewCases(newcases)
    const countryObj = {
      country,
      state,
      key,
      coords: [parseFloat(row[longIndex]), parseFloat(row[latIndex])],
      totalcases,
      newcases,
      maxnewcases
    }
    regions[key] = countryObj
  })
  return regions
}

function dailyNewCases(totalCases) {
  return totalCases.map((dailyValue, index) => {
    if(index === 0) return 0
    return dailyValue - totalCases[index - 1]
  })
}

// returns maximum daily new cases up until this point in the epidemic
function maxNewCases(newCases) {
  let max = 0
  return newCases.map((dailyNew) => {
    if(dailyNew > max) max = dailyNew
    return max
  })
}
