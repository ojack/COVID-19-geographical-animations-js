const html = require('choo/html')
const devtools = require('choo-devtools')
const choo = require('choo')
const dataStore = require('./app/stores/data.js')
const Mapbox = require('./app/components/Mapbox.js')

const app = choo()
app.use(devtools())
app.use(dataStore)
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`<body class="w-100 h-100 flex flex-column flex-row-ns georgia">
    ${state.cache(Mapbox, `test-map`).render(state)}
  </body>`
}
