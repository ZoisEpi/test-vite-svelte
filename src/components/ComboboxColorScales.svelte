<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import * as d3 from 'd3';

  export let colorScales = [];
  export let selectedScale = "";
  export let width = 500;

  const dispatch = createEventDispatcher();

  let isDropdownOpen = false;
  let dropdownRef;
  let comboboxRef;

  const leftComboStyle = (width - 200) / 2;

  function getGradient(scaleName) {
    const scale = d3[scaleName];
    const gradient = [];
    const numSteps = 10;
    for (let i = 0; i < numSteps; i++) {
      gradient.push(scale(i / (numSteps - 1)));
    }
    return gradient.join(', ');
  }

  function handleSelect(scaleName) {
    selectedScale = scaleName;
    dispatch('select', { scale: scaleName });
    isDropdownOpen = false;
  }

  function closeDropdown() {
    isDropdownOpen = false;
  }

  function toggleDropdown() {
    isDropdownOpen ? closeDropdown() : isDropdownOpen = true;
  }

  function handleClickOutside(event) {
    if (
      dropdownRef &&
      comboboxRef &&
      !dropdownRef.contains(event.target) &&
      !comboboxRef.contains(event.target)
    ) {
      closeDropdown();
    }
  }

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
    background-color: var(--main-bg-color);
    border: 1px solid hsla(0, 0%, 80%, 0.404);
    border-radius: 4px;
    font-size: 14px;
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
    align-items: flex-start;
    flex-direction: column;
    padding: 6px;
  }

  .color-scale-box-wrapper {
    position: relative;
    width: 100%;
  }

  .color-scale-label {
  position: absolute;
  top: 0em;
  left: 50%;
  transform: translateX(-50%);
  font-family : "Georgia, serif";
  font-size: 14px;
  opacity: 0.3;
  background-color: rgba(255, 255, 255, 0.1);
  transition: opacity 0.2s;
  pointer-events: none;
  }

  .color-scale-item:hover .color-scale-label {
    opacity: 0.8;
  }

  .color-scale-box {
    width: 300px;
    height: 20px;
    border-radius: 2px;
  }

  .dropdown-item:hover {
    background-color: var(--main-bg-color);
  }

  .color-scale-item.selected .color-scale-box {
    outline: 2px solid white;
    outline-offset: 1px;
    border-radius: 3px;
  }
</style>

<div class="combobox-container" bind:this={comboboxRef}>
  <!-- Combo box (shows only gradient of selected scale) -->
  <div class="combobox" on:click={toggleDropdown}>
    <div class="color-scale-box" style="background: linear-gradient(to right, {getGradient(selectedScale)})"></div>
  </div>

  {#if isDropdownOpen}
    <div class="dropdown" bind:this={dropdownRef}>
      {#each colorScales as scaleName}
        <div
          class="color-scale-item dropdown-item {selectedScale === scaleName ? 'selected' : ''}"
          on:click={() => handleSelect(scaleName)}
        >
          <div class="color-scale-box-wrapper">
            <div class="color-scale-label" style="color: black" >{ ' ' + scaleName + ' '}
              
            </div>
            <div
              class="color-scale-box"
              style="background: linear-gradient(to right, {getGradient(scaleName)})"
            ></div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
