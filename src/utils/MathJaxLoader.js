let loaded = false;

export async function loadMathJaxOnce() {
  if (loaded || window.MathJax) return;

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
  loaded = true;
}