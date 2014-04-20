module.exports = function Environment(){

	var C_ENV_VAR = process.env.RA_MAINSERVER_ENV;

	if (typeof C_ENV_VAR === 'undefined' || (C_ENV_VAR !== 'RA_TEST' && C_ENV_VAR !== 'RA_PROD')){
		C_ENV_VAR = 'LOCAL';
	}
	else if (C_ENV_VAR  === 'RA_TEST'){
		C_ENV_VAR = 'TEST';
	}
	else{
		C_ENV_VAR = 'PROD';
	}

	return {
		getEnvrionment: function(){
			return C_ENV_VAR;
		}
	};
};
