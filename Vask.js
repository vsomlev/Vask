function Vask(){

	var tasks = [];
	var final_collect = null;
	var seq_pointer = 0;
	var par_finished = 0;
	var results = [];

	// #### SEQUENTIAL
	
	var seq_callback = function(res){
		console.log('SEQ CALLBACK ' + res);
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
		// TODO: length checks everywhere, starting here
		var t1 = tasks_list[0];
		t1.exec(seq_callback);
	};
	
	// #### PARALLEL

	var parallel_callback = function(task_index){
		var parallel_callback_internal = function(res){
			console.log('PAR CALLBACK [' + task_index + '] ' + res);
			results[task_index] = res;
			par_finished++;

			if(par_finished == tasks.length) {
				final_collect(results);
			}
		};
		return parallel_callback_internal;
	};

	this.parallel = function(tasks_list, final_collect_func) {
		tasks = tasks_list;
		final_collect = final_collect_func;
		results = new Array(tasks_list.length);
		// TODO: length checks everywhere, starting here
		for(var i=0; i<tasks_list.length; i++){
			var t = tasks_list[i];
			t.exec(parallel_callback(i));
		}
	};


	// Task class
	this.Task = function(func, params, post_proc_func){
		this.func = func;
		this.params = params;
		this.post_proc = post_proc_func ||  function(x){ return x;};

		// before calling the externally supplied callback, run the post-processing function
		this.internal_callback_closure = function(i_external_callback, i_post_proc){
			var internal_callback = function(res){
				console.log('INTERNAL_CALLBACK ' + res);
				var post_res = i_post_proc(res);
				i_external_callback(post_res);
			};
			return internal_callback;
		};

		this.exec = function(callback){
			console.log('---------------------');
			console.log('EXEC');
			internal_callback = this.internal_callback_closure(callback, this.post_proc);
			func(params, internal_callback);
		};
	};
};
