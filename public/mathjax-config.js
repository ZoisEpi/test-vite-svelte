window.MathJax = {
  loader: { 
    load: ['input/tex', 'output/svg', '[tex]/ams', '[tex]/color'] // <-- ajoute le package ams
  },
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    packages: ['base', 'ams', 'color'] // <-- autorise les commandes AMS
  },
  svg: {
    fontCache: 'local',
    font: 'STIX-Web'
  }
};