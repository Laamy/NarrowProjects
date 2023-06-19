window.NarrowSDK.Cosmetics.Wings.Paper = {
	Geometry: new THREE.BoxGeometry(0, 0.3, 0.4),
	Offset: new THREE.Vector3(0, 1.3, -0.2)
};

window.NarrowSDK.Cosmetics.Wings.Paper.Texture = (function () {
	var texture = new THREE.TextureLoader().load(window.electronApi.dirname + '/assets/paper_wing.png');
	texture.transparent = true;
	texture.alphaTest = 0.5;
	return texture;
})();

window.NarrowSDK.Cosmetics.Wings.Paper.Material = new THREE.MeshBasicMaterial({
	map: window.NarrowSDK.Cosmetics.Wings.Paper.Texture,
	transparent: true
});