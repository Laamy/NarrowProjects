// copied directly from narrow.one source
class InputKey {
	constructor({
		keyCodes: t = [],
		mouseButtons: e = [],
		gamepadButtons: i = []
	} = {}) {
		this.keyCodes = t,
			this.mouseButtons = e,
			this.gamepadButtons = i,
			this.pressed = !1,
			this.pressedGamepad = !1,
			this.onPressedChangeCbs = new Set,
			this.onPressedDownCbs = new Set,
			this.onPressedUpCbs = new Set
	}
	setKeyCodePressed(t, e, i) {
		let s = !1,
			n = !1;
		return this.keyCodes.includes(t) && (n = this.setKeyPressed(e, i), s = !0), {
			needsPreventDefault: s,
			preventOthers: n
		}
	}
	setMouseButtonPressed(t, e, i) {
		return !!this.mouseButtons.includes(t) && this.setKeyPressed(e, i)
	}
	setPressedGamepadButtons(t, e) {
		let i = !1;
		for (const e of this.gamepadButtons)
			if (t.includes(e)) {
				i = !0;
				break
			}
		return this.pressedGamepad != i && (this.pressedGamepad = i, this.setKeyPressed(i, e))
	}
	setKeyPressed(t, e = !1) {
		let i = !1;
		if (t != this.pressed && (this.pressed = t, !e)) {
			for (const e of this.onPressedChangeCbs) {
				e(t) && (i = !0)
			}
			if (t)
				for (const t of this.onPressedDownCbs) {
					t() && (i = !0)
				}
			else
				for (const t of this.onPressedUpCbs) {
					t() && (i = !0)
				}
		}
		return i
	}
	onPressedChange(t) {
		this.onPressedChangeCbs.add(t)
	}
	onPressedDown(t) {
		this.onPressedDownCbs.add(t)
	}
	onPressedUp(t) {
		this.onPressedUpCbs.add(t)
	}
	removeCb(t) {
		const e = t;
		this.onPressedChangeCbs.delete(e),
			this.onPressedDownCbs.delete(e),
			this.onPressedUpCbs.delete(e)
	}
}