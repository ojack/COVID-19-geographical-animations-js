const load = require('resl')
const csv = require('./../lib/process-csv.js')
const src = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
const html = require('choo/html')

const d3 = require('d3')

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
    },
    tooltip: {
      content: null,
      data: null,
      point: [0, 0]
    }
  }

  state.map = {
    fill: '#f0f',
    radius: 1
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

emitter.on('dataset:setDate', (dateIndex) => {
    state.dataset.dateIndex = dateIndex
    setMapData()
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
      setMapData()
    } else {
      stopPlaying()
    }
  }
  emitter.emit('render')
}

const colorScale = d3.scaleSequential([1, 0], d3.interpolateRdYlBu)
const radiusScale = d3.scaleSqrt([0, 10000], [1, 40])
  function setMapData() {
    var fillExpression = ['match', ['get', 'id']]
    var radiusExpression = ['match', ['get', 'id']]
    Object.values(state.data).forEach((entry, index) => {
      const max = entry.maxnewcases[state.dataset.dateIndex]
      const newCases = entry.newcases[state.dataset.dateIndex]
      const val = max == 0 ? 0 : newCases/max
      const color = colorScale(val)
      const radius = radiusScale(newCases)
    //  console.log(val, color)
      fillExpression.push(index, color)
      radiusExpression.push(index, radius)
    })

      fillExpression.push(`rgba(0, 255, 0, 1)`)
      radiusExpression.push(0)
      state.map.fill = fillExpression
      state.map.radius = radiusExpression
      const _d = state.ui.tooltip.data
    if(_d !== null) {
      setTooltip(_d)

    }
  }

  emitter.on('ui:clearTooltip', () => {
      state.ui.tooltip.content = null
      state.ui.tooltip.data = null
      emitter.emit('render')
    })

    emitter.on('ui:setTooltip', (data, point) => {
      setTooltip(data)
      // const d = state.data[data.properties[state.dataset.geoKey]]
      //  console.log(state.dataset.geoKey, d)
      // state.ui.tooltip.content = `${d.name}: ${getCurrentData(d)}`
      // = data
      state.ui.tooltip.point = point
      // if(data !== null) {
      //   emitter.emit('ui:setPanel', data)
      // }
      emitter.emit('render')
    })

    function setTooltip(data) {
    if(state.data !== null) {

      const key = Object.keys(state.data)[data.id]
      console.log(data.id, key)
      const d = state.data[key]
      state.ui.tooltip.content = html`
      <div class="f7">
        <div>${key}</div>
        <div>new cases: ${Math.round(d.newcases[state.dataset.dateIndex])}</div>
        <div>total cases: ${d.totalcases[state.dataset.dateIndex]}</div>
      </div>
      `
      state.ui.tooltip.data = data
      //
      // // const index = state.dataset.geoKey === null ? 0 : data.properties[state.dataset.geoKey]
      // const d = state.data[data.properties[state.dataset.geoKey]]
      // //const d = state.data[data.properties['nuts3']]
      // state.ui.tooltip.content = `${d.name}: ${getCurrentData(d)}`
      // state.ui.tooltip.data = data
    }
  }
}
