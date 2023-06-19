// global setup stuff
{
    window.NarrowSDK.Electron.Cosmetic = {
        Include: function (file) {
            eval(window.electronApi.SendSync("client-getfile", "/Cosmetic/" + file));
        }
    };

    NarrowSDK.Cosmetics = {};
    NarrowSDK.Cosmetics.Wings = {};
}

const Include = window.NarrowSDK.Electron.Cosmetic.Include;

// cosmetics includes
Include("Cosmetics/Wings/DragonWing.js");
Include("Cosmetics/Wings/PaperWing.js");

NarrowSDK.Utils.CreateWings = function (wingMaterial) {
    const wingsModel = new THREE.Group();

    const leftWing = new THREE.Mesh(wingMaterial.Geometry, wingMaterial.Material);
    leftWing.position.x = 0.2;
    leftWing.rotation.y = -10;

    const rightWing = new THREE.Mesh(wingMaterial.Geometry, wingMaterial.Material);
    rightWing.position.x = -0.2;
    rightWing.rotation.y = 10;

    wingsModel.add(leftWing, rightWing);

    return wingsModel;
}

NarrowSDK.Utils.UpdateWings = function (wingMaterial, player) {
    let wingsModel;

    // get the wings model
    if (player.wingsModel) {
        wingsModel = player.wingsModel;
    }
    else {
        // create the model and assign it to the player
        wingsModel = NarrowSDK.Utils.CreateWings(wingMaterial);
        NarrowSDK.Scene.add(wingsModel);
        player.wingsModel = wingsModel;
    }

    // update the wings model position in the world
    const meshWorldPosition = player.position;
    const offsetPosition = wingMaterial.Offset.clone().applyQuaternion(player.quaternion);
    const groupPosition = meshWorldPosition.add(offsetPosition);
    wingsModel.position.copy(groupPosition);
    wingsModel.rotation.copy(player.rotation);

    wingsModel.updateMatrix();
    wingsModel.updateWorldMatrix(false, true);

    wingsModel.visible = player.visible;
}

// might make this verified people only to avoid people using usernames to get cosmetics
window.NarrowSDK.HardcodedWings = {
    "YeemiRouth": { type: "Dragon" },
    "Ansy": { type: "Paper" }
};