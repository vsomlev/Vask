// Task execution class
Vasker = function(){
	var tasks = [];
	var final_collect = null;
	var results = [];
    var is_sequence = true;

   	var result_callback = function(res, task_index){
		results[task_index] = res;

        var next_task = tasks.shift();
        if(typeof next_task === 'undefined'){
			final_collect(results);
		} else if (is_sequence) {
            next_task.exec(result_callback, ++task_index);
		}
	};

	this.sequence = function(tasks_list, final_collect_func) {
		tasks = tasks_list;
        var task_count = tasks.length;
		final_collect = final_collect_func;
		results = new Array(task_count);

		var first_task = tasks.shift();
		first_task.exec(result_callback, 0);
	};

	this.parallel = function(tasks_list, final_collect_func) {
        // is_sequence=false makes sure that the result_callback
        // is not concerned with further exec'ing (as in with 'sequence').
		is_sequence = false;
        
        this.sequence(tasks_list, final_collect_func);
        // unlike sequence this exec's all tasks right away
        tasks.forEach(function(task, task_index){
            task.exec(result_callback, task_index+1);
        });
	};
};

// Task class
Vask = function(func, params, post_proc_func){
    var params = params || {};
    var post_proc = post_proc_func || function(x){return x};
	// case when 'params' is left out and the 2nd argument is actually the post-processing function.
    if(typeof params == 'function'){
        post_proc = params;
    	params = {};
    }

    // before calling the vasker result callback, run the post-processing function
    var internal_callback_closure = function(result_callback, i_post_proc, task_index){
        var internal_callback = function(res){
            var postproc_result = i_post_proc(res);
            result_callback(postproc_result, task_index);
        };
        return internal_callback;
    };

    this.exec = function(result_callback, task_index){
        internal_callback = internal_callback_closure(result_callback, post_proc, task_index);
        func(params, internal_callback);
    };
};