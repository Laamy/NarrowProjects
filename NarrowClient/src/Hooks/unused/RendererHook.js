function InitializeRendererHook() {
	// Store the prototype of the main instances renderer
	let RendererProtoType = Object.getPrototypeOf(NarrowSDK.Main.renderer);

	// store the original renderer reload function reference
	let __o__reloadRenderer = RendererProtoType.reloadRenderer;

	// replace old reload renderer with new function
	RendererProtoType.reloadRenderer = function () { // recreation of old reload renderer code for once i want to use this for extra shit
		let _this = NarrowSDK.Main.renderer;

		_this.canvas && (_this.canvas.remove(), _this.canvas = null);
		_this.renderer = null;

		const t = NarrowSDK.Main.settingsManager.getValue("antialias");

		try {
			_this.renderer = new ObfThreeApi.WebGLRenderer({
				antialias: t,
				powerPreference: "high-performance",
				alpha: true
			});
		} catch (e) {
			console.error("Failed to create WebGLRenderer:", t);
			_this.webglCreationFailed = true;
			NarrowSDK.Main.mainInfoTextManager.updateText();
		}

		_this.renderer && (_this.renderer.outputEncoding = ObfThreeApi.sRGBEncoding, _this.renderer.autoClear = !1, _this.canvas = _this.renderer.domElement, _this.canvas.classList.add("fullScreen", "mainCanvas"), _this.canvas.inert = !0, document.body.appendChild(_this.canvas)),
			_this.updateSmoothFiltering(),
			_this.onResize()
	}

	NarrowSDK.Main.renderer.reloadRenderer();
}