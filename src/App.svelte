<script>
  import ComboboxColorScales from './components/ComboboxColorScales.svelte';
  import D3Graph from './components/D3Graph.svelte';
  import D3Slider from './components/D3Slider.svelte';
  import Compute from './components/Compute.svelte';
  import MathJaxRenderer from './components/MathJaxRenderer.svelte';

  const expression = '\\prod_{i=1}^{n} (ai +b)\\cdot \\sin(x)';
  const sizeSampling = 700;
  const width = sizeSampling;
  const height = sizeSampling;

  let data = [];

  const colorScales = [
    'interpolateSpectral',
    'interpolateRainbow',
    'interpolateSinebow',
    'interpolateTurbo',
    'interpolateViridis',
    'interpolateInferno',
    'interpolateMagma',
    'interpolatePlasma',
    'interpolateCool',
    'interpolateWarm',
    'interpolateRdYlGn',
    'interpolateRdYlBu',
    'interpolateRdGy',
    'interpolateRdBu',
    'interpolatePuOr',
    'interpolatePiYG',
    'interpolatePRGn',
    'interpolateBrBG',
    'interpolateBlues',
    'interpolateGreens',
    'interpolateOranges',
    'interpolatePurples',
    'interpolateReds',
    'interpolateCividis',
    'interpolateGreys'
  ];

let selectedColorScale = colorScales[0];

let sliderValue = 0.15;
let triggerValueIm = sliderValue;

let sliderValueR = 0.80;
let triggerValueRe = sliderValueR;

let sliderValueIter = 15;
let triggerValueIter = sliderValueIter;

function handleColorScaleSelection(event) {
  selectedColorScale = event.detail.scale;
}

function handleCalculated(event) {

  data = event.detail;  // Récupérer les données calculées
}

function handleSliderImChange(value) {
    console.log(value);
    sliderValue = value;
    triggerValueIm = sliderValue;
}

function handleSliderReChange(value) {
    console.log(value);
    sliderValueR = value;
    triggerValueRe = sliderValueR;
}

function handleSliderIterChange(value) {
    console.log(value);
    sliderValueIter = value;
    triggerValueIter = sliderValueIter;
}

</script>
<style>
  .layout {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1rem;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .left-column,
  .right-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 300px;
    flex: 0 0 300px;
  }

  .center-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    flex: 1 1 auto;
    min-width: 500px;
  }
</style>

<Compute {sizeSampling} {triggerValueIm} {triggerValueRe} {triggerValueIter} on:calculated={handleCalculated} />

<div class="layout">
  <!-- Colonne gauche -->
  <div class="left-column">
    <MathJaxRenderer tex={expression} />
    <D3Slider {selectedColorScale} bind:value={sliderValue} on:change_value={(e) => handleSliderImChange(e.detail)} />
    <D3Slider {selectedColorScale} bind:value={sliderValueR} on:change_value={(e) => handleSliderReChange(e.detail)} />
    <D3Slider {selectedColorScale} step={1} min = {1} max = {50} bind:value={sliderValueIter} on:change_value={(e) => handleSliderIterChange(e.detail)} />
  </div>

  <!-- Colonne centrale -->
  <div class="center-column">
    <ComboboxColorScales {colorScales} {width} on:select={handleColorScaleSelection} />
    <D3Graph {data} {width} {height} {selectedColorScale} />
  </div>

  <!-- Colonne droite (vide ou à utiliser plus tard) -->
  <div class="right-column"></div>
</div>
