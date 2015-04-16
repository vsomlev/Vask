function delayed(params, callback){
	var timeout = params['timeout'];
	// var timeout = params;
	console.log('Setting up timeout ' + timeout);
	window.setTimeout(callback, timeout, 'TIMEOUT_PARAM_'+timeout);
};

function delayed_postproc(res){
	console.log('DELAYED_POSTPROC ' + res);
	return res;
};

function final_collect(res){
	console.log('---------------------');
	console.log('FINAL COLLECT ' + res);
};

function vask_test(){
    var v = new Vask();

    var t1 = new v.Task(delayed, {'timeout':1000}, delayed_postproc);
    var t2 = new v.Task(delayed, {'timeout':2000});
    var t3 = new v.Task(delayed, {'timeout':3000});

    // v.sequence(
		// [t1, t2, t3],
		// final_collect
	// );
    v.parallel(
		[t1, t3, t2],
		final_collect
	);
};
