import * as d3 from 'd3';

export function createSvgGradient(svgEl, scaleName, gradientId) {

    if(!svgEl || !scaleName) {
        return;
    }

    const scale = d3[scaleName];
    if (!scale || !svgEl) return;

    const defs = svgEl.select('defs').empty()
    ? svgEl.append('defs')
    : svgEl.select('defs');

    defs.select(`#${gradientId}`).remove(); // remove existing

    let gradient = defs.append('linearGradient')
    .attr('id', gradientId)
    .attr('x1', '0%')
    .attr('x2', '100%')
    .attr('y1', '0%')
    .attr('y2', '0%');

    let steps = 10;
    for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    gradient.append('stop')
        .attr('offset', `${t * 100}%`)
        .attr('stop-color', scale(t));
    }

    defs.select(`#${gradientId}`+ `R` ).remove(); // remove existing

    gradient = defs.append('linearGradient')
    .attr('id', gradientId + 'R')
    .attr('x1', '0%')
    .attr('x2', '100%')
    .attr('y1', '0%')
    .attr('y2', '0%');

    steps = 10;
    for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    gradient.append('stop')
        .attr('offset', `${t * 100}%`)
        .attr('stop-color', scale(1 - t));
    }
}