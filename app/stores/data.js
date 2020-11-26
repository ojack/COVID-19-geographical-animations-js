const load = require('resl')
const csv = require('./process-csv.js')
const src = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'

module.exports = (state, emitter) => {
  state.data = null

  load({
    manifest: {
      'data': {
        type: 'text',
        src: src
      }
    },
    onDone: (assets) => {
      const dataByRegion = csv(assets.data)
      console.log(dataByRegion)
      state.data = dataByRegion
      emitter.emit('render')
    }
  })
}
