# Vask
Execute async JS functions in parallel/sequence. 

# Basics
Each function is enclosed in a separate Vask. 

	    var task = new Vask(async_func, {'some_param':'foo'}, post_processing_func);
	    
You can also pass some parameters to the function by putting them in the dict. The data returned by the function can optionally be processed by a supplied function before being stored - the post-processing function should have a single parameter and should return a value.  
Both the parameters dict and the post-processing function are optional.  
The async function **must** have the following signature:  

	  function async_func(params, callback){...}  
	  
'params' will be the dict from the Vask above. 'callback' is what the async function should set as the callback of its asynchronous action; it accepts a single parameter.

Now you can create a new Vasker and have it execute all your vasks in parallel or in sequence. Once all the vasks have finished, their results are stored in an array (order is same as the order of the vasks list) and the array is passed to results_callback().

	var task_runner = new Vasker();
	// in sequence
	task_runner.sequence(
		[task1, task2, task3],
		results_callback
	);
	
	// in parallel
	task_runner.parallel(
		[task1, task2, task3],
		results_callback
	);

For a more complete example see **vasker_example.js**.

# TODO
- Visibility of vars. 
- Error/Exception handling
- Allow cancellation of Vasks
- Fix the damn formatting of this README file.

