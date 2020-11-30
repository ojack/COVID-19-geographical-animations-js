const html = require('choo/html')

module.exports = (state, emit) => {
  if(state.data === null) return ''
  const dates = state.dataset.dates
  const dateIndex = state.dataset.dateIndex
  const isPlaying = state.ui.timeline.isPlaying
  return html`
    <div class="flex items-center pa2" style="pointer-events:all">
      <!-- <div class="mr2 tc w3 pointer ba dim pa2" onclick=${() => emit('togglePlay')}>${isPlaying ? 'Pause': 'Play'}</div> -->
      <i class="fas tc pointer f2 dim pa2 gray ${isPlaying ? 'fa-pause-circle':'fa-play-circle'}"
        onclick=${() => emit('togglePlay')}
      ></i>
      <input class="flex-auto" oninput=${(e)=>emit('dataset:setDate', parseFloat(e.target.value))} type="range" id="date" name="date" min="0" max=${dates.length - 1} value=${dateIndex}>
      <div class="mr2 pa2 f3 gray">${dates[dateIndex]}</div>
    </div>`
}


  // <!-- <div class="mr2 pa2">${state.data.dates[state.dateIndex]}</div> -->
