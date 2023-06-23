// store the original function reference so we can call it later
const __o__bind = Function.prototype.bind;

// replace the old function with our new modified one
Function.prototype.bind = function (_this, ...options) {
	// make sure it has a reference to its "this" defined
	if (_this !== undefined && _this !== null) {

		// check if it has the input manager which is unique to narrows main instance class
		if (_this.input !== undefined) {

			// store main instance class for later use
			NarrowSDK.Main = _this;
		}
	}

	// execute the original functions code to complete hook
	return __o__bind.call(this, _this, ...options);
}

// log info to console
console.log("[Function.prototype.bind, BindingHook] Successfully enabled");