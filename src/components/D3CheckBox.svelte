<script>
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    export let height = 50;
    export let value_id = "im"
    export let value_group = "";
              
    export let label = 'toto';        
    export let gradientId = 'gradient-default'; 
    
    let checkPath = null;
    let text = null;
    let box = null;

    const marginLeft = 10;
  
    const dispatch = createEventDispatcher();
    let container;
  
    function updateCheckbox() {
        if(!checkPath) {
            return;
        }

        checkPath.style("visibility", value_group === value_id ? "visible" : "hidden");
        box.style("opacity", value_group === value_id ? 1 : 0.5);
        text.style("opacity", value_group === value_id ? 1 : 0.8);
    }

    $ : {
        console.log(value_id + " check reçoit " + value_group);
        updateCheckbox();
    }
  
    onMount(() => {
      const boxSize = 20;
  
      const svg = d3.select(container)
        .append("svg")
        .attr("width", 200)
        .attr("height", height)
        .style("cursor", "pointer");
  
      const yOffset = (height - boxSize) / 2; // Centrage vertical
  
      box = svg.append("rect")
        .attr("x", marginLeft)
        .attr("y", yOffset)
        .attr("width", boxSize)
        .attr("height", boxSize)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr('fill', 'url(#' + gradientId + ')')
        .attr('fill-opacity', 0.3)
        .attr('stroke', 'url(#' + gradientId + ')')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.8); 
  
      checkPath = svg.append("path")
        .attr("d", `M${marginLeft + 4},${yOffset + 10} L${marginLeft + 8},${yOffset + 14} L${marginLeft + 16},${yOffset + 4}`)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
  
      text = svg.append("text")
        .attr("x", 36 + marginLeft)
        .attr("y", yOffset + 14)
        .text(label)
        .style("font-size", "16px")
        .style("font-family", "Georgia, serif") 
        .style("fill", "var(--text-color)")  
        .style("user-select", "none")     
  
      updateCheckbox();

      svg.on("click", () => {
        dispatch('change_check', value_id);
      });
    });
  </script>
  
  <div
    bind:this={container}
    style="height: {height}px; text-align: left;"
  ></div>
  