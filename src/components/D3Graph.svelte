<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { i, im } from "mathjs";

  const margin = 50;
  export let width = 500;
  export let height = 500;

  const fullWidth = width + 2 * margin;
  const fullHeight = height + 2 * margin;
  export let data = [];
  export let triggerValueZoomPi = 1;
  export let selectedColorScale;
  export let visuType = "im";
  $: scale = d3[selectedColorScale];

  var context = null;
  var scaleQuantile = null;

  let extractedValue = (k) => data[2 * k];

  $: if (visuType === "re") {
    extractedValue = (k) => data[2 * k];
    computeScale();
    drawGraph();
  } else if (visuType === "im") {
    extractedValue = (k) => data[2 * k + 1];
    computeScale();
    drawGraph();
  } else if (visuType === "im - re") {
    extractedValue = (k) => Math.abs(data[2 * k + 1]) - Math.abs(data[2 * k]);
    computeScale();
    drawGraph();
  } else if (visuType === "rho") {
    extractedValue = (k) => Math.sqrt(data[2 * k] ** 2 + data[2 * k + 1] ** 2);
    computeScale();
    drawGraph();
  } else if (visuType === "theta") {
    extractedValue = (k) => Math.atan2(data[2 * k + 1], data[2 * k]);
    computeScale();
    drawGraph();
  }

  let xAxis = null;
  let yAxis = null;
  let svg = null;

  let tickFormatPi = (d) =>
          ({
            [-1]: "-π",
            [-0.5]: "-π/2",
            0: "0",
            [0.5]: "π/2",
            [1]: "π",
          })[d];

    $ : {
      let  piFactor = triggerValueZoomPi;
      console.log("pi Factor : " + piFactor)

      if(xAxis || yAxis) {
        tickFormatPi = (d) =>
                ({
                  [-1]: piFactor == 1 ? "-π" : "-π/"+piFactor,
                  [-0.5]: "-π/" + 2*piFactor,
                  0: "0",
                  [0.5]: "π/" + 2*piFactor,
                  [1]: piFactor == 1 ?  "π" : "π/"+piFactor,
                })[d];
        console.log("in axis : " + piFactor)
        
        xAxis.tickFormat(
          tickFormatPi
        );

        yAxis.tickFormat(
          tickFormatPi
        );

        svg.select("g.x-axis").call(xAxis);
        svg.select("g.y-axis").call(yAxis);
      }
    }

  const limit = 5_000_000;
  let container;

  onMount(() => {
    const margin = 50;

    computeScale();

    svg = d3
      .select(container.querySelector("svg"))
      .attr("width", width + margin * 2)
      .attr("height", height + margin * 2);

    const xScale = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([height, 0]);

    xAxis = d3
      .axisBottom(xScale)
      .tickValues([-1, -0.5, 0, 0.5, 1])
      .tickFormat(
        tickFormatPi
      );

    yAxis = d3
      .axisLeft(yScale)
      .tickValues([-1, -0.5, 0, 0.5, 1])
      .tickFormat(
        tickFormatPi
      );

    svg
      .append("g")
      .attr("transform", `translate(${margin}, ${height + margin})`)
      .attr("class", "x-axis")
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "16px")
      .style("font-family", "Georgia, serif")
      .style("fill", "var(--text-color)");

    svg
      .append("g")
      .attr("transform", `translate(${margin}, ${margin})`)
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "16px")
      .style("font-family", "Georgia, serif")
      .style("fill", "var(--text-color)");

    const canvas = container.querySelector("canvas");
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext("2d");
    // context.imageSmoothingEnabled = false;
    drawGraph();
  });

  $: if (scale) {
    drawGraph();
  }

  $: if (data.length) {
    computeScale();
    drawGraph();
  }

  let imagePrev = null;

  function drawGraph() {
    if (!context) return;

    const imageNext = context.createImageData(width, height);
    const imageData = imageNext.data;

    for (let i = 0; i < width; ++i) {
      for (let j = 0; j < height; ++j) {
        const testIm = extractedValue(i * height + j); //data[(i * height + j) *2 + 1];
        const index = 4 * (height * j + i);

        if (!isNaN(testIm) && Math.abs(testIm) < limit) {
          const color = d3.rgb(scale(scaleQuantile(testIm)));
          imageData[index] = color.r;
          imageData[index + 1] = color.g;
          imageData[index + 2] = color.b;
          imageData[index + 3] = 255;
        } else {
          imageData.set([0, 0, 0, 255], index);
        }
      }
    }

    // If this is the first render, skip transition
    if (!imagePrev) {
      context.putImageData(imageNext, 0, 0);
      imagePrev = imageNext;
      return;
    }

    // Animate transition
    const duration = 1500;
    const start = performance.now();

    function animate(now) {
      const t = Math.min((now - start) / duration, 1);
      const blended = context.createImageData(width, height);

      for (let i = 0; i < imageData.length; i += 4) {
        blended.data[i] = (1 - t) * imagePrev.data[i] + t * imageNext.data[i];
        blended.data[i + 1] =
          (1 - t) * imagePrev.data[i + 1] + t * imageNext.data[i + 1];
        blended.data[i + 2] =
          (1 - t) * imagePrev.data[i + 2] + t * imageNext.data[i + 2];
        blended.data[i + 3] = 255;
      }

      context.putImageData(blended, 0, 0);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        imagePrev = imageNext;
      }
    }

    requestAnimationFrame(animate);
  }

  function computeScale() {
    console.time("Quantiles D3");
    const count = data.length / 2;

    const colorPix = [];
    for (let i = 0; i < count; i++) {
      const re = extractedValue(i); //data[(i * 2) +1];
      if (isFinite(re) && Math.abs(re) < limit) {
        colorPix.push(re);
      }
    }
    colorPix.sort(d3.ascending);
    const numQuantiles = 100;
    const quantileThresholds = d3
      .range(numQuantiles + 1)
      .map((d) => d3.quantileSorted(colorPix, d / numQuantiles));
    scaleQuantile = d3
      .scaleLinear()
      .domain(quantileThresholds)
      .range(d3.range(numQuantiles + 1).map((d) => d / numQuantiles));
    console.timeEnd("Quantiles D3");
  }
</script>

<div
  class="graph-wrapper"
  bind:this={container}
  style="width: {fullWidth}px; height: {fullHeight}px;"
>
  <canvas {width} {height} style="--position-margin: {margin}px;"></canvas>
  <svg width={fullWidth} height={fullHeight}></svg>
</div>

<style>
  .graph-wrapper {
    position: relative;
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
  }

  canvas {
    position: absolute;
    top: var(--position-margin);
    left: var(--position-margin);
  }

  .axis-label {
    font-size: 30px; /* Or try 18px, 20px, etc */
    font-family: "serif"; /* Optional: make it match math style */
  }
</style>
