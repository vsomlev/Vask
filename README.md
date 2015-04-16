# Vask
Execute async JS functions in parallel/sequence

# Example

1. Create instance of Vasker. 
2. Wrap the async functions in Vasks. 

    var task = new Vask(async_func, {'some_param':'foo'}, post_processing_func);

The first and only required parameter of a Vask is the async function. This function must have the following signature, where 'params' is a dictionary of named parameters:

    function async_func(params, callback){...}

The second parameter of a Vask's definition - 'params', is optional.
The optional third parameter 'post_processing_func' is a function that allows you to transform the result from async_func() before it is stored. The data returned by async_func() is the single argument of the post-processing function; something is expected to be returned by the post-processing function as well.

3. Run several Vasks in parallel or in sequence. The results are stored in an array, which is then passed to the final callback provided ('result_callback' in the example below).

    // (1)
    var task_runner = new Vasker();

	// (2)
    var task1 = new Vask(async_func1);
    var task2 = new Vask(async_func2, {'user':'Peter'});
    var task3 = new Vask(async_func3, {'timeout':3000}, func1_post_processing);

    // (3)
    // in sequence
    task_runner.sequence(
	    [task1, task2, task3],
	    result_callback
    );

    // in parallel
    task_runner.parallel(
	    [task1, task2, task3],
	    result_callback
    );

For a more complete example see vasker_example.js

# TODO
- Visibility of vars. 
- Error/Exception handling
- Allow cancellation of Vasks

