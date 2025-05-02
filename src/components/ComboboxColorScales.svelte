<script>
    import { createEventDispatcher } from 'svelte';
    import * as d3 from 'd3';
  
    export let colorScales = [];  // List of D3 color scales passed from the parent
    const dispatch = createEventDispatcher();
  
    let isDropdownOpen = false;
    let dropdownRef;
    let comboboxRef;

    export let width = 500;
    const leftComboStyle = (width - 200)/2;
  
    // Set the default color scale selection
    export let selectedScale = "";  // Set default to the first scale in the list
  
    // Function to generate the gradient for each scale
    function getGradient(scaleName) {
      const scale = d3[scaleName];  // Get the scale from D3 (e.g., d3.interpolateGreens)
      const gradient = [];
      const numSteps = 10;  // Number of gradient steps
  
      for (let i = 0; i < numSteps; i++) {
        gradient.push(scale(i / (numSteps - 1)));
      }
  
      return gradient.join(', ');
    }
  
    // Handle selection of a color scale
    function handleSelect(scaleName) {
      selectedScale = scaleName;
      dispatch('select', { scale: scaleName });
      isDropdownOpen = false; 
    }
  
    // Toggle dropdown visibility
    function toggleDropdown() {
      isDropdownOpen = !isDropdownOpen;
    }
  
    // Close dropdown if clicked outside
    function handleClickOutside(event) {
      if (
        dropdownRef &&
        comboboxRef &&
        !dropdownRef.contains(event.target) &&
        !comboboxRef.contains(event.target)
      ) {
        isDropdownOpen = false;
      }
    }
  
    // Listen for outside clicks
    import { onMount, onDestroy } from 'svelte';
    onMount(() => {
      window.addEventListener('click', handleClickOutside);
    });
  
    onDestroy(() => {
      window.removeEventListener('click', handleClickOutside);
    });
  </script>
  
  <style>
    .combobox-container {
      position: relative;
      width: 300px;
      cursor: pointer;
    }
  
    .combobox {
      width: 300px;
      padding: 8px;
      background-color:  var(--main-bg-color);
      border: 1px solid hsla(0, 0%, 80%, 0.404);
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  
    .dropdown {
      position: absolute;
      width: 320px;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 100;
      background-color: var(--main-bg-color);
      border: 1px solid #ccc;
      border-radius: 4px;
      max-height: 200px;
      overflow-y: auto;
    }
  
    .color-scale-item {
      display: flex;
      align-items: center;
      padding: 10px;
      cursor: pointer;
    }
  
    .color-scale-box {
      width: 300px;
      height: 20px;
    }
  
    .dropdown-item:hover {
      background-color:  var(--main-bg-color);
    }

    .color-scale-item.selected .color-scale-box {
      outline: 2px solid white; /* ou autre couleur selon ton thème */
      outline-offset: 1px;
      border-radius: 3px;
    }
  </style>
  
  <div class="combobox-container"  bind:this={comboboxRef}>

    <!-- Combo box input field (the button to trigger the dropdown) -->
    <div class="combobox" on:click={toggleDropdown}>
      <!-- Show the gradient of the selected color scale -->
      <div class="color-scale-box" style="background: linear-gradient(to right, {getGradient(selectedScale)})"></div>
    </div>
  
    <!-- Dropdown list (toggle visibility based on isDropdownOpen) -->
    {#if isDropdownOpen}
      <div class="dropdown" bind:this={dropdownRef}>
        {#each colorScales as scaleName}
          <div
          class="color-scale-item dropdown-item {selectedScale === scaleName ? 'selected' : ''}"
          on:click={() => handleSelect(scaleName)}>
            <!-- Gradient box for color scale -->
            <div class="color-scale-box" style="background: linear-gradient(to right, {getGradient(scaleName)})"></div>
          </div>
        {/each}
      </div>
    {/if}
  </div>