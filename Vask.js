// Task execution class
Vasker = function(){

	var tasks = [];
	var final_collect = null;
	var seq_pointer = 0;
	var par_finished = 0;
	var results = [];

	// #### SEQUENTIAL
	
	// Called by each sequential task after it's finished.
	var seq_callback = function(res){
		// console.log('SEQ CALLBACK ' + res);
		results[seq_pointer] = res;
		seq_pointer++;

		if(seq_pointer == tasks.length) {
			final_collect(results);
		} else {
			var next_task = tasks[seq_pointer];
			next_task.exec(seq_callback);
		}
	};

	this.sequence = function(tasks_list, final_collect_func) {
		tasks = tasks_list;
		final_collect = final_collect_func;
		results = new Array(tasks_list.length);

		var first_task = tasks_list[0];
		first_task.exec(seq_callback);
	};
	
	// #### PARALLEL

	// Called by each parallel task when it's finished.
	var parallel_callback = function(task_index){
		var parallel_callback_internal = function(res){
			// console.log('PARALLEL CALLBACK [' + task_index + '] ' + res);
			results[task_index] = res;
			par_finished++;

			if(par_finished == tasks.length){
				final_collect(results);
			}
		};
		return parallel_callback_internal;
	};

	this.parallel = function(tasks_list, final_collect_func) {
		tasks = tasks_list;
		final_collect = final_collect_func;
		results = new Array(tasks_list.length);

		for(var i=0; i<tasks_list.length; i++){
			var task = tasks_list[i];
			task.exec(parallel_callback(i));
		}
	};

};

// Task class
Vask = function(func, params, post_proc_func){
    this.func = func;
    this.params = params || {};
    this.post_proc = post_proc_func || function(x){ return x;};
	// case when 'params' is left out and the 2nd argument is actually the post-processing function.
    if(typeof params == 'function'){
    	this.params = {};
    	this.post_proc = params;
    }

    // before calling the externally supplied callback, run the post-processing function
    this.internal_callback_closure = function(i_external_callback, i_post_proc){
        var internal_callback = function(res){
            // console.log('INTERNAL_CALLBACK ' + res);
            var post_res = i_post_proc(res);
            i_external_callback(post_res);
        };
        return internal_callback;
    };

    this.exec = function(callback){
        console.log('-----------EXEC----------');
        internal_callback = this.internal_callback_closure(callback, this.post_proc);
        this.func(this.params, internal_callback);
    };
};

