const html = require('choo/html')

module.exports = (tooltip, emit) => {
//  console.log(tooltip)

  const opacity = tooltip.content === null ? 0 : 1
  const content = tooltip.content
  // === null ? '' :
  return html`<div id="tooltip"
    class="absolute pa3"
    style="top:${tooltip.point.y + 40 }px;left:${tooltip.point.x + 10}px;pointer-events:none;opacity:${opacity};transition:opacity 0.5s;background:rgba(255, 255, 255, 0.9)"
    >
      ${content}
  </div>`
}
