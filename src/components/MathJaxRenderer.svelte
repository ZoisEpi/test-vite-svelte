<script>
    import { onMount, afterUpdate } from 'svelte';
    export let tex = ''; // L'expression LaTeX
    let container;
    let mathjaxReady = false;
  
    async function loadMathJax() {
      if (window.MathJax) {
        mathjaxReady = true;
        return;
      }
  
      await new Promise((resolve) => {
        const configScript = document.createElement('script');
        configScript.src = '/mathjax-config.js';
        configScript.onload = resolve;
        document.head.appendChild(configScript);
      });
  
      await new Promise((resolve) => {
        const mjScript = document.createElement('script');
        mjScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
        mjScript.async = true;
        mjScript.onload = resolve;
        document.head.appendChild(mjScript);
      });
  
      await window.MathJax.startup.promise;
      mathjaxReady = true;
    }
  
    function renderMath() {
      if (window.MathJax && container) {
        container.innerHTML = tex ? `\\(${tex}\\)` : '';
        window.MathJax.typesetPromise([container]);
      }
    }
  
    onMount(async () => {
      await loadMathJax();
      renderMath();
    });
  
    afterUpdate(() => {
      if (mathjaxReady) renderMath();
    });
  </script>
  
  <!-- Affichage de la formule -->
  <div bind:this={container} class="math-expression" />
  
  <style>
    .math-expression {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 2em;
      font-size: 1em;
    }
  </style>