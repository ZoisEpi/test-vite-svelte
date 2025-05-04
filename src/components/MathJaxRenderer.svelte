<script>
  import { afterUpdate } from 'svelte';
  export let tex = '';
  let container;

  function renderMath() {
    if (window.MathJax && container) {
      container.innerHTML = tex ? `\\(${tex}\\)` : '';
      window.MathJax.typesetPromise([container]);
    }
  }

  afterUpdate(renderMath);
</script>

<div bind:this={container} class="math-expression" />
  
  <style>
    .math-expression {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 1.75em;
      font-size: 1em;
    }
  </style>