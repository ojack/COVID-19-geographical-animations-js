const html = require('choo/html')
const Component = require('choo/component')
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
const { mapbox } = require('./../config.js')


mapboxgl.accessToken = mapbox.accessToken
module.exports = class Mapbox extends Component {
  constructor (id, state, emit) {
    super(id)
    this.emit = emit
  //  this.polygons = null
    this.styleLoaded = false
    // can only paint when style is fully loaded (if a style has been specified)
    this.pointsLoaded = false
  }

  loadPoints(data) {
    console.log('loading points')
    const features = Object.values(data).map((feature, index) => {
      return {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': feature.coords,
        },
        'id': index,
        'properties': {}
      //  'properties': feature
      }
    })
    const geojson = {
        'type': 'FeatureCollection',
        'features': features
      }

    console.log(JSON.stringify(geojson, 2))
  //  console.log(features)
    this.map.addSource('points', {
      'type': 'geojson',
      'data': geojson
    })

    this.map.addLayer({
      'id': 'points',
      'type': 'circle',
      'source': 'points',
      'paint': {
        'circle-color': '#f00',
        'circle-opacity': 0.7,
        'circle-radius': 6
      }
    })
  //   this.polygons = polygons
  //   this.map.addSource('polygons', {
  //     type: 'geojson',
  //     data: this.polygons
  //   })
  //
  //   this.map.addLayer({
  //     'id': 'polygon-fills',
  //     'type': 'fill',
  //     'source': 'polygons',
  //     'paint': {
  //       'fill-color': '#000',
  //       'fill-opacity': [ 'case', ['boolean', ['feature-state', 'hover'], false], 0.5, 1 ]
  //     }
  //   })
  //
  // //  this.loadBaseStyle()
  //   // map.addLayer({
  //   //   'id': 'polygon-borders',
  //   //   'type': 'line',
  //   //   'source': 'polygons',
  //   //   'layout': {},
  //   //   'paint': {
  //   //   'line-color': '#627BC1',
  //   //   'line-width': 2
  //   //   }
  //   // });
  //   //})
       this.pointsLoaded = true
  }


  load (el) {
    var map = new mapboxgl.Map({
      container: el,
      //  style: 'white-bg',
      style: 'mapbox://styles/mapbox/light-v10',
      // center: [9.00, 51.00],
      zoom: 1
    });


  //  this.styleIsLoaded =
  this.map = map
//   //this.loadBaseStyle()
  this.map.on('load', () => {
     this.styleLoaded = true
//   //  this.rerender()
    this.emit('render')
  })
//
//     let hoverId = null
//
//     map.on('mousedown', 'polygon-fills', (e) => {
//       //  console.log(e.features)
//       if(e.features.length > 0) this.emit('ui:setPanel', e.features[0])
//     })
//
//     map.on('mousemove', 'polygon-fills', (e) => {
//       //  console.log(e, e.features[0])
//       if (hoverId) {
//         map.setFeatureState(
//           { source: 'polygons', id: hoverId },
//           { hover: false }
//         );
//       }
//       if(e.features.length > 0) {
//         hoverId = e.features[0].id
//         map.setFeatureState(
//           { source: 'polygons', id: hoverId },
//           { hover: true }
//         );
//         //console.log(e.features[0])
//         this.emit('ui:setTooltip', e.features[0], e.point)
//       }
//     })
//
//     map.on('mouseleave', 'polygon-fills', (e) => {
//       //   console.log(e)
//       if (hoverId) {
//         map.setFeatureState(
//           { source: 'polygons', id: hoverId },
//           { hover: false }
//         );
//       }
//       hoverId = false
//       this.emit('ui:clearTooltip', null, e.point)
//     })
//
//     this.map = map

  }

  update ({ data, fill = '#0f0' }) {
    if(data !== null) {
      this.data = data
      if(this.styleLoaded && !this.pointsLoaded) {
        this.loadPoints(data)
      }
    }
  //   if(this.polygons === null) {
  //   //  console.log('polygons', this.styleLoaded, polygons)
  //     if(polygons !== null && this.styleLoaded) this.loadPolygons(polygons)
  //   }
  // // setPaintProperty can only be called if something has been loaded to the map (either a style or a polygon layer)
    if(this.pointsLoaded) this.map.setPaintProperty('points', 'circle-color', fill)
    return false
  }

  createElement () {
  //  this.fill = fill
    return html`<div class="w-100 h-100"></div>`
  }
}
