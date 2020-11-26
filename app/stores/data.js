const load = require('resl')
const csv = require('csv-parse/lib/sync')
const src = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'

module.exports = (state, emit) => {
  state.data = null

  load({
    manifest: {
      'data': {
        type: 'text',
        src: src
      //src: './data/test.json'
        // parser: JSON.parse
      }
    },
    onDone: (assets) => {
      console.log(assets.data)
      const parsed = csv(assets.data)
      console.log(parsed)

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
        const key = `${country}-${state}`
        const countryObj = {
          country,
          state,
          key,
          coords: [parseFloat(row[latIndex]), parseFloat(row[longIndex])],
          timeseries: row.slice(timeseriesStart).map((val) => parseFloat(val))
        }
        regions[key] = countryObj
      })
    }
  })
}
