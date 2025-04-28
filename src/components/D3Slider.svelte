<script>

    import * as d3 from 'd3';
    import { onMount } from 'svelte';   
    import { createEventDispatcher } from 'svelte';

    import { createSvgGradient } from '../utils/colorUtils.js';

    const dispatch = createEventDispatcher();
    
    export let value = 0.5;
    export let min = 0;
    export let max = 1.5;
    export let selectedColorScale = 'interpolateViridis';
    export let height = 50;
    export let gradientId = 'gradient-default'; 
    export let step = 0.01;

   // let container;
    let sliderElement; 

    $: colorScale = d3[selectedColorScale];
    const marginExt = 10;
    var sliderWidth = 0;
    var sliderRectangle = 0;

    var svg = null;
    var circle = null;
    var shadeRect = null;
    var text = null;

    $: if (colorScale) {
        createSvgGradient(svg, selectedColorScale, gradientId);
        
        if(circle) {
            circle.attr('fill', colorScale((value - min)/(max - min)));
        }
    }

    onMount(() => {
      const { width, heightF } = sliderElement.getBoundingClientRect();
      sliderWidth = width;
      sliderRectangle = sliderWidth - 2*marginExt;

      svg = d3.select(sliderElement)
        .append('svg')
        .attr('width', sliderWidth)
        .attr('height', height);
    
      createSvgGradient(svg, selectedColorScale, gradientId);
  
      // Création de la ligne de fond du slider
      const background = svg.append('g').attr('class', 'slider-background');
      background.append('rect')
        .attr('x', marginExt)
        .attr('y', 30)
        .attr('rx', 5)
        .attr('width', sliderRectangle)
        .attr('height', 8)  
  
       background.append('rect')
        .attr('x', marginExt)
        .attr('y', 30)
        .attr('rx', 5)
        .attr('width', sliderRectangle)
        .attr('height', 8)
        .attr('fill', 'url(#' + gradientId + ')')
        .attr('opacity', 0.4)
        .attr('stroke', 'url(#' + gradientId + ')')
        .attr('stroke-width', 3);

      shadeRect = background.append('rect')
        .attr('x', marginExt + ((value - min) / (max - min)) * (sliderRectangle))
        .attr('y', 30)
        .attr('rx', 5)
        .attr('width', sliderRectangle - ((value - min) / (max - min)) * (sliderRectangle))
        .attr('height', 8)
        .attr('fill', '#bbb')
        .attr('opacity', 0.6)       
        .attr('stroke', '#bbb')
        .attr('stroke-opacity', 0)      
        .attr('stroke-width', 2);

      circle = svg.append('circle')
        .attr('cx', marginExt + ((value - min) / (max - min)) * (sliderRectangle))
        .attr('cy', 34)
        .attr('r', 8)
        .attr('fill', colorScale((value - min)/(max - min)))
        .attr('stroke', '#000')
        .attr('stroke-width', 1);

      const drag = d3.drag()
        .on('drag', function(event) {
          const newValue = Math.max(min, Math.min(max, min + ((event.x - marginExt) / sliderRectangle) * (max - min)));
          updateText(text, newValue);

          if(event.x >= marginExt && event.x <= marginExt + sliderRectangle) {
            updateSlider(circle, shadeRect, event.x, newValue);
          }

        })
        .on('end', function(event) {
          const newValue = Math.max(min, Math.min(max, min + ((event.x - marginExt) / sliderRectangle) * (max - min)));
          dispatch('change_value',  snapToStep(newValue, step, 10) ); 
        });
  
      circle.call(drag); 

      text = svg.append("text")
            .attr("x", sliderWidth / 2)       
            .attr("y", 15)           
            .attr("text-anchor", "middle")
            .attr("fill", "white")          
            .text(value.toFixed(2));         
    });


    function updateText(text, value) {
        let valueToShow = snapToStep(value, step, 10);
        text.text(valueToShow);
    }

    function updateSlider(circle, shadeRect, pos, value) {

        if(!circle || !shadeRect) {
            return;
        }

        circle
        .attr('cx', pos)
        .attr('fill', colorScale((value - min)/(max - min)));

        shadeRect
        .attr('x', pos)
        .attr('width', sliderRectangle + marginExt - pos)
    }

    function snapToStep(value, step, precision) {
        let snapped =  Math.round(value / step) * step;
        return parseFloat(snapped.toFixed(precision));
    }

</script>
  
  
<style>
    .graph-wrapper {
    position: relative;
    width: 100%;       
  }
</style>
    

<div
  class="graph-wrapper"
      
  bind:this={sliderElement}
  style="height: {height}px;"
  >

</div>
  