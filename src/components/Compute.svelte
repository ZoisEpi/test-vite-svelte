<script>

    import * as math from 'mathjs';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  



	export let sizeSampling;
  export let triggerValueIm = 0.15;
  export let triggerValueRe = 0.80;
  export let triggerValueIter = 15;

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

function computeData() {

  const c = math.complex(triggerValueRe, triggerValueIm) ;

	var step = (sizeOfReal*2)/(sizeTest);
	var sinTest = [];
    for(var i = 0; i < sizeTest; ++i) {
	    for(var j = 0; j < sizeTest; ++j) {
			var comp =  math.complex((-1*sizeOfReal) + (i*step), (-1*sizeOfReal) + (j*step));
			sinTest.push(math.multiply(math.sin(comp),c));
		}
    }

    for(i =0; i < triggerValueIter; i++) {
        sinTest = sinTest.map(function(d) {
				if(isFinite(d.re)) return math.multiply(math.sin(d),c);
				return NaN;	
    });

    }


    dispatch('calculated', sinTest);

}

computeData();

  </script>
  
 
