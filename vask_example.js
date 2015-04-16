function delayed(params, callback){
	var timeout = params['timeout'] || 2000;
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

function vask_example(){
    var v = new Vasker();

    var t1 = new Vask(delayed, {'timeout':1000}, delayed_postproc);
    var t2 = new Vask(delayed);
    var t3 = new Vask(delayed, delayed_postproc);
    var t4 = new Vask(delayed, {'timeout':3000});

    v.sequence(
		[t1, t2, t3, t4],
		final_collect
	);
    // v.parallel(
		// [t1, t2, t3, t4],
		// final_collect
	// );
};
