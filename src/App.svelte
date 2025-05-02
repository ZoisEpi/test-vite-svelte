<script>
  import ComboboxColorScales from './components/ComboboxColorScales.svelte';
  import D3Graph from './components/D3Graph.svelte';
  import D3Slider from './components/D3Slider.svelte';
  import D3CheckBox from './components/D3CheckBox.svelte';


  import Compute from './components/Compute.svelte';
  import MathJaxRenderer from './components/MathJaxRenderer.svelte';

  const expression = 'f(x) = \\prod_{k=1}^{{n}} ({a}i + {b}) \\cdot \\sin(x)';
  const expression2 = 'x \\in \\mathbb{C} \\mid \\{ \\text{Re}(x),\\text{Im}(x) \\in [-\\pi, \\pi] \\}'
  const sizeSampling = 700;
  const width = sizeSampling;
  const height = sizeSampling;

  let data = [];

  const colorScales = [
    'interpolateSpectral',
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
    'interpolateGreys',
    'interpolateRainbow',
    'interpolateSinebow',
  ];

let selectedColorScale = 'interpolateViridis';

let sliderValue = 0.19;
let triggerValueIm = sliderValue;

let sliderValueR = 0.98;
let triggerValueRe = sliderValueR;

let sliderValueIter = 35;
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

let visuType = "im";

function handleChangeVisuType(value) {
  visuType = value;
  console.log("Checkbox is now", visuType);
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
    <MathJaxRenderer tex={expression2} />
    <MathJaxRenderer tex={expression} />
    <MathJaxRenderer tex={""} />
    <D3Slider {selectedColorScale} step={0.01} min = {0} max = {1.5} title={"a"} bind:value={sliderValue} on:change_value={(e) => handleSliderImChange(e.detail)} />
    <D3Slider {selectedColorScale} step={0.01} min = {0} max = {1.5} title={"b"} bind:value={sliderValueR} on:change_value={(e) => handleSliderReChange(e.detail)} />
    <D3Slider {selectedColorScale} step={1} min = {1} max = {50} title={"n"} bind:value={sliderValueIter} on:change_value={(e) => handleSliderIterChange(e.detail)} />
  </div>

  <!-- Colonne centrale -->
  <div class="center-column">
    
    <D3Graph {data} {width} {height} {selectedColorScale} {visuType}/>
  </div>

  <!-- Colonne droite (vide ou à utiliser plus tard) -->
  <div class="right-column">
    <ComboboxColorScales {colorScales} {width} bind:selectedScale={selectedColorScale} on:select={handleColorScaleSelection} />
    <MathJaxRenderer tex={ 'f(x) = \\operatorname{Re}(x) + i \\cdot \\operatorname{Im}(x)'} />

    <D3CheckBox height={30} value_id={"re"} label={"Re(x)"} bind:value_group={visuType} on:change_check={(e) => handleChangeVisuType(e.detail)} />
    <D3CheckBox height={30} value_id={"im"} label={"Im(x)"} bind:value_group={visuType} on:change_check={(e) => handleChangeVisuType(e.detail)} />
    
    <MathJaxRenderer tex={ 'f(x) = \\rho(x) \\cdot e^{i \\theta(x)}'} />  

    <D3CheckBox height={30} value_id={"rho"} label={"ρ(x)"} bind:value_group={visuType} on:change_check={(e) => handleChangeVisuType(e.detail)} />
    <D3CheckBox height={30} value_id={"theta"} label={"θ(x)"} bind:value_group={visuType} on:change_check={(e) => handleChangeVisuType(e.detail)} />
    
 
    </div>

</div>
