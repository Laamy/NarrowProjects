window.NarrowSDK.Cosmetics.Wings.Dragon = {
	Geometry: new THREE.BoxGeometry(0, 0.3, 0.4),
	Offset: new THREE.Vector3(0, 1.3, -0.2)
};

window.NarrowSDK.Cosmetics.Wings.Dragon.Texture = (function () {
	var texture = new THREE.TextureLoader().load(window.electronApi.dirname + '/assets/default_wing.png');
	texture.transparent = true;
	texture.alphaTest = 0.5;
	return texture;
})();

window.NarrowSDK.Cosmetics.Wings.Dragon.Material = new THREE.MeshBasicMaterial({
	map: window.NarrowSDK.Cosmetics.Wings.Dragon.Texture,
	transparent: true
});