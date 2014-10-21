import {utils} from '../utils/utils';
var translate = (left, top) => 'translate(' + left + ',' + top + ')';
var rotate = (angle) => 'rotate(' + angle + ')';
var getOrientation = (scaleOrient) => _.contains(['bottom', 'top'], scaleOrient.toLowerCase()) ? 'h' : 'v';

var fnDrawDimAxis = function (x, AXIS_POSITION, sectorSize, size) {
    var container = this;
    if (x.scaleDim) {

        var axisScale = d3.svg.axis().scale(x.scaleObj).orient(x.guide.scaleOrient);

        axisScale.ticks(_.max([Math.round(size / x.guide.density), 4]));

        var nodeScale = container
            .append('g')
            .attr('class', x.guide.cssClass)
            .attr('transform', translate.apply(null, AXIS_POSITION))
            .call(axisScale);

        nodeScale
            .selectAll('.tick text')
            .attr('transform', rotate(x.guide.rotate))
            .style('text-anchor', x.guide.textAnchor);

        if ('h' === getOrientation(x.guide.scaleOrient)) {

            if (x.scaleType === 'ordinal') {
                nodeScale
                    .selectAll('.tick line')
                    .attr('x1', sectorSize / 2)
                    .attr('x2', sectorSize / 2);
            }

            nodeScale
                .append('text')
                .attr('transform', rotate(x.guide.label.rotate))
                .attr('class', 'label')
                .attr('x', x.guide.size * 0.5)
                .attr('y', x.guide.label.padding)
                .style('text-anchor', x.guide.label.textAnchor)
                .text(x.guide.label.text);
        }
        else {

            if (x.scaleType === 'ordinal') {
                nodeScale
                    .selectAll('.tick line')
                    .attr('y1', -sectorSize / 2)
                    .attr('y2', -sectorSize / 2);
            }

            nodeScale
                .append('text')
                .attr('transform', rotate(x.guide.label.rotate))
                .attr('class', 'label')
                .attr('x', -x.guide.size * 0.5)
                .attr('y', -x.guide.label.padding)
                .style('text-anchor', x.guide.label.textAnchor)
                .text(x.guide.label.text);
        }
    }
};

var fnDrawGrid = function (node, H, W) {

    var container = this;

    var grid = container
        .append('g')
        .attr('class', 'grid')
        .attr('transform', translate(0, 0));

    var linesOptions = (node.guide.showGridLines || '').toLowerCase();
    if (linesOptions.length > 0) {

        var gridLines = grid.append('g').attr('class', 'grid-lines');

        if ((linesOptions.indexOf('x') > -1) && node.x.scaleDim) {
            var x = node.x;
            var xGridAxis = d3.svg.axis().scale(x.scaleObj).orient(x.guide.scaleOrient).tickSize(H);

            xGridAxis.ticks(_.max([Math.round(W / x.guide.density), 4]));

            var xGridLines = gridLines.append('g').attr('class', 'grid-lines-x');
            xGridLines.call(xGridAxis);

            if (x.scaleType === 'ordinal') {
                let sectorSize = W / node.domain(x.scaleDim).length;
                gridLines
                    .selectAll('.tick line')
                    .attr('x1', sectorSize / 2)
                    .attr('x2', sectorSize / 2);
            }
        }

        if ((linesOptions.indexOf('y') > -1) && node.y.scaleDim) {
            var y = node.y;
            var yGridAxis = d3.svg.axis().scale(y.scaleObj).orient(y.guide.scaleOrient).tickSize(-W);

            yGridAxis.ticks(_.max([Math.round(H / y.guide.density), 4]));

            var yGridLines = gridLines.append('g').attr('class', 'grid-lines-y');
            yGridLines.call(yGridAxis);
            if (y.scaleType === 'ordinal') {
                let sectorSize = H / node.domain(y.scaleDim).length;
                yGridLines
                    .selectAll('.tick line')
                    .attr('y1', -sectorSize / 2)
                    .attr('y2', -sectorSize / 2);
            }
        }

        // TODO: make own axes and grid instead of using d3's in such tricky way
        gridLines.selectAll('text').remove();
    }

    return grid;
};

var generateColor = function (node) {
    var defaultRange = _.times(10, (i) => 'color10-' + (1 + i));
    var range, domain;
    var colorGuide = (node.guide || {}).color || {};
    var colorParam = node.color;

    var colorDim = colorParam.scaleDim;
    var brewer = colorGuide.brewer || defaultRange;

    if (utils.isArray(brewer)) {
        domain = node.domain(colorDim);
        range = brewer;
    }
    else {
        domain = Object.keys(brewer);
        range = domain.map((key) => brewer[key]);
    }

    return {
        get: (d) => d3.scale.ordinal().range(range).domain(domain)(d),
        dimension:colorDim
    };
};
/* jshint ignore:start */
var utilsDraw = {
    translate,
    rotate,
    getOrientation,
    fnDrawDimAxis,
    fnDrawGrid,
    generateColor
};
/* jshint ignore:end */

export {utilsDraw};