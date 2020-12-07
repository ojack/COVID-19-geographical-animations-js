const html = require('choo/html')
const devtools = require('choo-devtools')
const choo = require('choo')
const dataStore = require('./app/stores/data.js')
const Mapbox = require('./app/components/Mapbox.js')
const timeline = require('./app/components/timeline.js')
const tooltip = require('./app/components/tooltip.js')


const app = choo()
app.use(devtools())
app.use(dataStore)
app.route('/', mainView)
app.route('/COVID-19-geographical-animations-js', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`<body class="w-100 h-100 flex flex-column lato pa0 dark-gray">


        ${state.cache(Mapbox, `test-map`).render({
          data: state.data,
          fill: state.map.fill,
          radius: state.map.radius
    }, emit)}
    <div class="flex flex-column justify-between pb3 ph3">
      <div>${timeline(state, emit)}</div>
      <div class="w-100 pa2 f6">
      <h4 class="b dark-gray f5"> COVID-19 geographical animation</h4>
      <p>Web version of <a href="https://github.com/hsayama/COVID-19-geographical-animations">Mathematica animations</a> by Hiroki Sayama.</p>
      The size of each disc represents the number of daily new positive cases (scaled). The color of the disc is determined by (# of daily new cases) / (max # of daily new cases observed up to that point), which ranges from 0 (end of epidemic; blue) to 1 (growing or peak of epidemic; red).
      Data was smoothed using seven-day moving averages.
      <p>Data from <a href="https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series"> Johns Hopkins University </a>.</p>
    </div>
  </div>
      ${tooltip(state.ui.tooltip, emit)}
  </body>`
}
