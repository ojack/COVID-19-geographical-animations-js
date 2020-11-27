const load = require('resl')
const csv = require('./../lib/process-csv.js')
const src = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'

const updateInterval = 200
module.exports = (state, emitter) => {
  state.data = null

  state.dataset = {
    dates: null,
    dateIndex: 0
  }

  state.ui = {
    timeline: {
      isPlaying: true
    }
  }

  load({
    manifest: {
      'data': {
        type: 'text',
        src: src
      }
    },
    onDone: (assets) => {
      const { dataByRegion, dates } = csv(assets.data)
      console.log(dataByRegion)
      state.data = dataByRegion
      state.dataset.dates = dates
      startPlaying()
      emitter.emit('render')
    }
  })

  emitter.on('togglePlay', () => {
  state.ui.timeline.isPlaying = !state.ui.timeline.isPlaying
  if(!state.ui.timeline.isPlaying) {
    stopPlaying()
  } else {
    startPlaying()
  }
  emitter.emit('render')
})

emitter.on('startPlaying', () => {
  state.ui.timeline.isPlaying = true
  startPlaying()
  console.log(state.ui.timeline.isPlaying)
  emitter.emit('render')
})

let timer

function stopPlaying() {
  state.ui.timeline.isPlaying = false
  clearInterval(timer)
}

function startPlaying() {
  if(state.dataset.dateIndex >= state.dataset.dates.length)
  state.dataset.dateIndex = 0
  clearInterval(timer)
  timer = setInterval(incrementDate, updateInterval)
}

function incrementDate() {
  if(state.ui.timeline.isPlaying) {
    if(state.dataset.dateIndex < state.dataset.dates.length - 1) {
      state.dataset.dateIndex++
    //  setMapData()
    } else {
      stopPlaying()
    }
  }
  emitter.emit('render')
}
}
