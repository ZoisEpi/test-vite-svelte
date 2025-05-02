<script>

    import * as math from 'mathjs';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  



	export let sizeSampling;
  export let triggerValueIm = 0.15;
  export let triggerValueRe = 0.80;
  export let triggerValueIter = 1;

	var sizeTest = sizeSampling;
  var sizeOfReal = Math.PI;

  $: if(triggerValueIm !== undefined) {
    console.log("im :" + triggerValueIm);
    computeData();
  }

  $: if(triggerValueRe !== undefined) {
    console.log("re :" + triggerValueRe);
    computeData();
  }

  $: if(triggerValueIter !== undefined) {
    console.log("iteration :" + triggerValueIter);
    computeData();
  }
  function sinComplex(re, im) {
  return {
    re: Math.sin(re) * Math.cosh(im),
    im: Math.cos(re) * Math.sinh(im)
  };
}

function mulComplex(a_re, a_im, b_re, b_im) {
  return {
    re: a_re * b_re - a_im * b_im,
    im: a_re * b_im + a_im * b_re
  };
}


function computeData() {



  const c = math.complex(triggerValueRe, triggerValueIm);

  const step = (sizeOfReal * 2) / sizeTest;
  const offset = -1 * sizeOfReal;

  const size = sizeTest;
  const count = size * size;

    
  console.time("sin julia compute Float64");



// Constante complexe c = c_re + i·c_im
  const c_re = triggerValueRe;
  const c_im = triggerValueIm;

// Résultat : tableau de complexes intercalés
  const sinTestFR = new Float64Array(count * 2);



// 1. Initialisation de la grille : z = sin(z0) * c
for (let i = 0; i < size; i++) {
  const re = offset + i * step;
  for (let j = 0; j < size; j++) {
    const im = offset + j * step;
    const idx = (i * size + j) * 2;

    const sinz = sinComplex(re, im);
    const result = mulComplex(sinz.re, sinz.im, c_re, c_im);

    sinTestFR[idx] = result.re;
    sinTestFR[idx + 1] = result.im;
  }
}

// 2. Itérations : z = sin(z) * c
for (let iter = 0; iter < triggerValueIter; iter++) {
  for (let k = 0; k < count; k++) {
    const idx = k * 2;
    const re = sinTestFR[idx];
    const im = sinTestFR[idx + 1];

    if (!isFinite(re) || !isFinite(im)) {
      sinTestFR[idx] = NaN;
      sinTestFR[idx + 1] = NaN;
      continue;
    }

    const sinz = sinComplex(re, im);
    const result = mulComplex(sinz.re, sinz.im, c_re, c_im);

    sinTestFR[idx] = result.re;
    sinTestFR[idx + 1] = result.im;
  }
}

console.timeEnd("sin julia compute Float64");


    dispatch('calculated', sinTestFR);

}

computeData();

  </script>
  
 
