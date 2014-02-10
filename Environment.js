module.exports = function Environment(){

	var C_ENV_VAR = 'LOCAL';

	return {
		getEnvrionment: function(){
			return C_ENV_VAR;
		}
	};
};
