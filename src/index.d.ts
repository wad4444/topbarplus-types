export type IconState = "Deselected" | "Selected" | "Viewing";
export type IconAlignment = "Left" | "Center" | "Right";

type FontFamilyLink<T extends string> = `rbxasset://fonts/families/${T}.json`;
type AllFontNames = keyof Omit<typeof Enum.Font, "GetEnumItems">;
type IconEventName = keyof IconEvents;

type InferSignalCallback<T> = T extends RBXScriptSignal<infer A> ? A : never;
type InferEventCallback<T extends IconEventName> = InferSignalCallback<IconEvents[T]>;

export type IconUID = string;

interface IconEvents {
	selected: RBXScriptSignal<() => void>;
	deselected: RBXScriptSignal<() => void>;
	toggled: RBXScriptSignal<(isSelected: boolean) => void>;
	viewingStarted: RBXScriptSignal<() => void>;
	viewingEnded: RBXScriptSignal<() => void>;
	notified: RBXScriptSignal<() => void>;
}

interface WidgetInstances {
	IconCorners: UICorner;
	Selection: Frame & { RotationSpeed: number };
	SelectionGradient: UIGradient;
	IconImage: ImageLabel;
	IconLabel: TextLabel;
	Widget: Frame & { MinimumWidth: number; MinimumHeight: number };
	IconButton: Frame;
	IconImageScale: NumberValue;
	IconImageCorner: UICorner;
	IconSpot: Frame;
	IconSpotGradient: UIGradient;
	IconOverlay: WidgetInstances["IconSpot"];
	IconGradient: UIGradient;
	ClickRegion: TextButton;
	Menu: ScrollingFrame;
	ContentsList: UIListLayout;
	Dropdown: Frame;
	Notice: Frame;
	NoticeLabel: TextLabel;
	PaddingLeft: Frame;
	PaddingRight: Frame;
	PaddingCenter: Frame;
	Contents: Frame;
	IconLabelContainer: Frame;
	IconImageRatio: UIAspectRatioConstraint;
}

type WidgetInstanceNames = keyof WidgetInstances;

type ModificationArray<
	InstanceName extends WidgetInstanceNames = WidgetInstanceNames,
	Property extends keyof WidgetInstances[InstanceName] = keyof WidgetInstances[InstanceName],
> = [InstanceName, Property, WidgetInstances[InstanceName][Property], IconState?];

type Modifications = ModificationArray | ModificationArray[];

interface Icon extends IconEvents {
	readonly name: string;
	readonly isSelected: boolean;
	readonly enabled: boolean;
	readonly totalNotices: number;
	readonly locked: boolean;

	/**
	 * Sets the name of the Widget instance.
	 * This can be used in conjunction with Icon.getIcon(name).
	 * @chainable
	 */
	setName(name: string): this;
	/** Returns the first descendant found within the widget of name instanceName. */
	getInstance(instanceName: string): Instance;
	/**
	 * Updates the appearance of the icon.
	 * See [themes](https://1foreverhd.github.io/TopbarPlus/features/#modify-theme) for more details.
	 * @chainable
	 */
	modifyTheme(modifications: Modifications): this;
	/**
	 * Updates the appearance of all icons that are parented to this icon (for example when a menu or dropdown).
	 * See [themes](https://1foreverhd.github.io/TopbarPlus/features/#modify-theme) for more details.
	 */
	modifyChildTheme(modifications: Modifications): void;
	/**
	 * When set to false the icon will be disabled and hidden.
	 * @chainable
	 */
	setEnabled(enabled: boolean): this;
	/**
	 * Selects the icon (as if it were clicked once).
	 * @chainable
	 */
	select(): this;
	/**
	 * Deselects the icon (as if it were clicked, then clicked again).
	 * @chainable
	 */
	deselect(): this;
	/**
	 * Prompts a notice bubble which accumulates the further it is prompted.
	 * If the icon belongs to a dropdown or menu, then the notice will appear on the parent icon when the parent icon is deselected.
	 * @chainable
	 */
	notify(clearNoticeEvent: RBXScriptSignal): this;
	/** @chainable */
	clearNotices(): this;
	/**
	 * When set to true, disables the shade effect which appears when the icon is pressed and released.
	 * @chainable
	 */
	disableOverlay(enabled: boolean): this;
	/**
	 * Applies an image to the icon based on the given imaageId.
	 * imageId can be an assetId or a complete asset string.
	 * @chainable
	 * @toggleable
	 */
	setImage(imageId: string, iconState?: IconState): this;
	/** @chainable @toggleable */
	setLabel(text: string, iconState?: IconState): this;
	/** @chainable @toggleable */
	setOrder(order: number, iconState?: IconState): this;
	/** @chainable @toggleable */
	setCornerRadius(scale: number, offset: number, iconState?: IconState): this;
	/**
	 * This enables you to set the icon to the "Left" (default), "Center" or "Right" side of the screen.
	 * See [alignments](https://1foreverhd.github.io/TopbarPlus/features/#alignments) for more details.
	 * @chainable
	 */
	align(alignment: IconAlignment): this;
	/**
	 * This sets the minimum width the icon can be (it can be larger for instance when setting a long label).
	 * The default width is 44.
	 * @chainable @toggleable
	 */
	setWidth(minimumSize: number, iconState?: IconState): this;
	/**
	 * How large the image is relative to the icon. The default value is 0.5.
	 * @chainable @toggleable
	 */
	setImageScale(scale: number, iconState?: IconState): this;
	/**
	 * How stretched the image will appear. The default value is 1 (a perfect square).
	 * @chainable @toggleable
	 */
	setImageRatio(ratio: number, iconState?: IconState): this;
	/**
	 * The size of the icon labels' text. The default value is 16.
	 * @chainable @toggleable
	 */
	setTextSize(size: number, iconState?: IconState): this;
	/**
	 * Sets the labels FontFace.
	 * Font can be a font family name (such as "Creepster"),
	 * a font enum (such as Enum.Font.Bangers),
	 * a font ID (such as 12187370928)
	 * or font family link (such as "rbxasset://fonts/families/Sarpanch.json").
	 * @chainable @toggleable
	 */
	setTextFont(
		font: Enum.Font | Font | AllFontNames | FontFamilyLink<AllFontNames>,
		fontWeight: Enum.FontWeight,
		fontStyle: Enum.FontStyle,
		iconState?: IconState,
	): this;
	/**
	 * Binds a GuiObject or LayerCollector to appear and disappeared when the icon is toggled.
	 * @chainable
	 */
	bindToggleItem(item: GuiObject | LayerCollector): this;
	/**
	 * Unbinds the given GuiObject or LayerCollector from the toggle.
	 * @chainable
	 */
	unbindToggleItem(item: GuiObject | LayerCollector): this;
	/**
	 * Connects to an [icon event](https://1foreverhd.github.io/TopbarPlus/api/#events) with iconEventName.
	 * It's important to remember all event names are in camelCase.
	 * The callback is called with arguments (self, ...) when the event is triggered
	 * @chainable
	 */
	bindEvent<T extends IconEventName>(name: T, callback: InferEventCallback<T>): this;
	/**
	 * Unbinds the connection of the associated iconEventName.
	 * @chainable
	 */
	unbindEvent(name: IconEventName): this;
	/**
	 * Binds a [keycode](https://create.roblox.com/docs/reference/engine/enums/KeyCode) which toggles the icon when pressed. See [toggle keys](https://1foreverhd.github.io/TopbarPlus/features/#toggle-keys) for more details.
	 * @chainable
	 */
	bindToggleKey(key: Enum.KeyCode): this;
	/**
	 * Unbinds the given keycode.
	 * @chainable
	 */
	unbindToggleKey(key: Enum.KeyCode): this;
	/**
	 * Calls the function immediately via task.spawn.
	 * The first argument passed is the icon itself.
	 * This is useful when needing to extend the behaviour of an icon while remaining in the chain.
	 * @chainable
	 */
	call(func: (icon: Icon) => void): this;
	/**
	 * Passes the given userdata to the icons janitor to be destroyed/disconnected on the icons destruction.
	 * If a function is passed, it will be called when the icon is destroyed.
	 * @chainable
	 */
	addToJanitor(userdata: Callback | thread | RBXScriptConnection | { Destroy(): void }): this;
	/**
	 * Prevents the icon being toggled by user-input (such as clicking),
	 * However the icon can still be toggled via localscript using methods such as icon:select().
	 * @chainable
	 */
	lock(): this;
	/**
	 * Re-enables user-input to toggle the icon again.
	 * @chainable
	 */
	unlock(): this;
	/**
	 * Locks the icon, yields for the given time, then unlocks the icon, effectively shorthand for icon:lock() task.wait(seconds) icon:unlock().
	 * This is useful for applying cooldowns (to prevent an icon from being pressed again) after an icon has been selected or deselected.
	 * @chainable @yields
	 */
	debounce(seconds: number): this;
	/**
	 * When set to true (the default) the icon is deselected when another icon (with autoDeselect enabled) is pressed.
	 * Set to false to prevent the icon being deselected when another icon is selected (a useful behaviour in dropdowns).
	 * @chainable
	 */
	autoDeselect(toggle: boolean): this;
	/**
	 * When set to true the icon will automatically deselect when selected.
	 * This creates the effect of a single click button.
	 * @chainable
	 */
	oneClick(toggle: boolean): this;
	/**
	 * Sets a caption. To remove, pass nil as text. See [captions](https://1foreverhd.github.io/TopbarPlus/features/#captions) for more details.
	 * @chainable
	 */
	setCaption(text: string | undefined): this;
	/**
	 * This customizes the appearance of the caption's hint without having to use icon:bindToggleKey.
	 * @chainable
	 */
	setCaptionHint(key: Enum.KeyCode): this;
	/**
	 * Creates a vertical dropdown based upon the given table array of icons.
	 * Pass an empty table {} to remove the dropdown. See [dropdowns](https://1foreverhd.github.io/TopbarPlus/features/#dropdowns) for more details.
	 * @chainable
	 */
	setDropdown(icons: Icon[]): this;
	/**
	 * Joins the dropdown of parentIcon.
	 * This is what icon:setDropdown calls internally on the icons within its array.
	 * @chainable
	 */
	joinDropdown(parentIcon: Icon): this;
	/**
	 * Creates a horizontal menu based upon the given array of icons.
	 * Pass an empty table {} to remove the menu. See [menus](https://1foreverhd.github.io/TopbarPlus/features/#menus) for more details
	 * @chainable
	 */
	setMenu(icons: Icon[]): this;
	/**
	 * Joins the menu of parentIcon.
	 * This is what icon:setMenu calls internally on the icons within its array.
	 * @chainable
	 */
	joinMenu(parentIcon: Icon): this;
	/**
	 * Unparents an icon from a parentIcon if it belongs to a dropdown or menu.
	 * @chainable
	 */
	leave(): this;
	/**
	 * Clears all connections and destroys all instances associated with the icon.
	 * @chainable
	 */
	destroy(): this;
}

interface IconConstructor {
	/** When set to false all TopbarPlus ScreenGuis are hidden. This does not impact Roblox's Topbar. */
	setTopbarEnabled: (enabled: boolean) => void;
	/** Sets the base DisplayOrder of all TopbarPlus ScreenGuis. */
	setDisplayOrder: (order: number) => void;
	/** Returns a dictionary of icons where the key is the icon's UID and value the icon. */
	getIcons(): Map<IconUID, Icon>;
	/** Returns an icon of the given name or UID. */
	getIcon(nameOrUID: string | IconUID): Icon | undefined;

	/** Updates the appearance of all icons. See [themes](https://1foreverhd.github.io/TopbarPlus/features/#modify-theme) for more details. */
	modifyBaseTheme(modifications: Modifications): void;

	new (): Icon;
}

export declare const Icon: IconConstructor;
