/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Inject, Injectable, LOCALE_ID, Optional, SkipSelf } from '@angular/core';
import { MatKeyboardRef } from '../classes/keyboard-ref.class';
import { MatKeyboardContainerComponent } from '../components/keyboard-container/keyboard-container.component';
import { MatKeyboardComponent } from '../components/keyboard/keyboard.component';
import { MAT_KEYBOARD_LAYOUTS } from '../configs/keyboard-layouts.config';
import { _applyAvailableLayouts, _applyConfigDefaults } from '../utils/keyboard.utils';
/**
 * Service to dispatch Material Design keyboard.
 */
export class MatKeyboardService {
    /**
     * @param {?} _overlay
     * @param {?} _live
     * @param {?} _defaultLocale
     * @param {?} _layouts
     * @param {?} _parentKeyboard
     */
    constructor(_overlay, _live, _defaultLocale, _layouts, _parentKeyboard) {
        this._overlay = _overlay;
        this._live = _live;
        this._defaultLocale = _defaultLocale;
        this._layouts = _layouts;
        this._parentKeyboard = _parentKeyboard;
        /**
         * Reference to the current keyboard in the view *at this level* (in the Angular injector tree).
         * If there is a parent keyboard service, all operations should delegate to that parent
         * via `_openedKeyboardRef`.
         */
        this._keyboardRefAtThisLevel = null;
        this._availableLocales = {};
        // prepare available layouts mapping
        this._availableLocales = _applyAvailableLayouts(_layouts);
    }
    /**
     * Reference to the currently opened keyboard at *any* level.
     * @private
     * @return {?}
     */
    get _openedKeyboardRef() {
        /** @type {?} */
        const parent = this._parentKeyboard;
        return parent ? parent._openedKeyboardRef : this._keyboardRefAtThisLevel;
    }
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    set _openedKeyboardRef(value) {
        if (this._parentKeyboard) {
            this._parentKeyboard._openedKeyboardRef = value;
        }
        else {
            this._keyboardRefAtThisLevel = value;
        }
    }
    /**
     * @return {?}
     */
    get availableLocales() {
        return this._availableLocales;
    }
    /**
     * @return {?}
     */
    get isOpened() {
        return !!this._openedKeyboardRef;
    }
    /**
     * Creates and dispatches a keyboard with a custom component for the content, removing any
     * currently opened keyboards.
     *
     * @param {?} layoutOrLocale layout or locale to use.
     * @param {?} config Extra configuration for the keyboard.
     * @return {?}
     */
    openFromComponent(layoutOrLocale, config) {
        /** @type {?} */
        const keyboardRef = this._attachKeyboardContent(config);
        keyboardRef.instance.darkTheme = config.darkTheme;
        keyboardRef.instance.isDebug = config.isDebug;
        // a locale is provided
        if (this.availableLocales[layoutOrLocale]) {
            keyboardRef.instance.locale = layoutOrLocale;
            keyboardRef.instance.layout = this.getLayoutForLocale(layoutOrLocale);
        }
        // a layout name is provided
        if (this._layouts[layoutOrLocale]) {
            keyboardRef.instance.layout = this._layouts[layoutOrLocale];
            keyboardRef.instance.locale = this._layouts[layoutOrLocale].lang && this._layouts[layoutOrLocale].lang.pop();
        }
        // When the keyboard is dismissed, lower the keyboard counter.
        keyboardRef
            .afterDismissed()
            .subscribe(() => {
            // Clear the keyboard ref if it hasn't already been replaced by a newer keyboard.
            if (this._openedKeyboardRef === keyboardRef) {
                this._openedKeyboardRef = null;
            }
        });
        if (this._openedKeyboardRef) {
            // If a keyboard is already in view, dismiss it and enter the
            // new keyboard after exit animation is complete.
            this._openedKeyboardRef
                .afterDismissed()
                .subscribe(() => {
                keyboardRef.containerInstance.enter();
            });
            this._openedKeyboardRef.dismiss();
        }
        else {
            // If no keyboard is in view, enter the new keyboard.
            keyboardRef.containerInstance.enter();
        }
        // If a dismiss timeout is provided, set up dismiss based on after the keyboard is opened.
        // if (configs.duration > 0) {
        //   keyboardRef.afterOpened().subscribe(() => {
        //     setTimeout(() => keyboardRef.dismiss(), configs.duration);
        //   });
        // }
        if (config.announcementMessage) {
            this._live.announce(config.announcementMessage, config.politeness);
        }
        this._openedKeyboardRef = keyboardRef;
        return this._openedKeyboardRef;
    }
    /**
     * Opens a keyboard with a message and an optional action.
     * @param {?=} layoutOrLocale A string representing the locale or the layout name to be used.
     * @param {?=} config Additional configuration options for the keyboard.
     * @return {?}
     */
    open(layoutOrLocale = this._defaultLocale, config = {}) {
        /** @type {?} */
        const _config = _applyConfigDefaults(config);
        return this.openFromComponent(layoutOrLocale, _config);
    }
    /**
     * Dismisses the currently-visible keyboard.
     * @return {?}
     */
    dismiss() {
        if (this._openedKeyboardRef) {
            this._openedKeyboardRef.dismiss();
        }
    }
    /**
     * Map a given locale to a layout name.
     * @param {?=} locale The layout name
     * @return {?}
     */
    mapLocale(locale = this._defaultLocale) {
        /** @type {?} */
        let layout;
        /** @type {?} */
        const country = locale
            .split('-')
            .shift();
        // search for layout matching the
        // first part, the country code
        if (this.availableLocales[country]) {
            layout = this.availableLocales[locale];
        }
        // look if the detailed locale matches any layout
        if (this.availableLocales[locale]) {
            layout = this.availableLocales[locale];
        }
        if (!layout) {
            throw Error(`No layout found for locale ${locale}`);
        }
        return layout;
    }
    /**
     * @param {?} locale
     * @return {?}
     */
    getLayoutForLocale(locale) {
        return this._layouts[this.mapLocale(locale)];
    }
    /**
     * Attaches the keyboard container component to the overlay.
     * @private
     * @param {?} overlayRef
     * @param {?} config
     * @return {?}
     */
    _attachKeyboardContainer(overlayRef, config) {
        /** @type {?} */
        const containerPortal = new ComponentPortal(MatKeyboardContainerComponent, config.viewContainerRef);
        /** @type {?} */
        const containerRef = overlayRef.attach(containerPortal);
        // set config
        containerRef.instance.keyboardConfig = config;
        return containerRef.instance;
    }
    /**
     * Places a new component as the content of the keyboard container.
     * @private
     * @param {?} config
     * @return {?}
     */
    _attachKeyboardContent(config) {
        /** @type {?} */
        const overlayRef = this._createOverlay();
        /** @type {?} */
        const container = this._attachKeyboardContainer(overlayRef, config);
        /** @type {?} */
        const portal = new ComponentPortal(MatKeyboardComponent);
        /** @type {?} */
        const contentRef = container.attachComponentPortal(portal);
        return (/** @type {?} */ (new MatKeyboardRef(contentRef.instance, container, overlayRef)));
    }
    /**
     * Creates a new overlay and places it in the correct location.
     * @private
     * @return {?}
     */
    _createOverlay() {
        /** @type {?} */
        const state = new OverlayConfig({
            width: '100%'
        });
        state.positionStrategy = this._overlay
            .position()
            .global()
            .centerHorizontally()
            .bottom('0');
        return this._overlay.create(state);
    }
}
MatKeyboardService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MatKeyboardService.ctorParameters = () => [
    { type: Overlay },
    { type: LiveAnnouncer },
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_KEYBOARD_LAYOUTS,] }] },
    { type: MatKeyboardService, decorators: [{ type: Optional }, { type: SkipSelf }] }
];
if (false) {
    /**
     * Reference to the current keyboard in the view *at this level* (in the Angular injector tree).
     * If there is a parent keyboard service, all operations should delegate to that parent
     * via `_openedKeyboardRef`.
     * @type {?}
     * @private
     */
    MatKeyboardService.prototype._keyboardRefAtThisLevel;
    /**
     * @type {?}
     * @private
     */
    MatKeyboardService.prototype._availableLocales;
    /**
     * @type {?}
     * @private
     */
    MatKeyboardService.prototype._overlay;
    /**
     * @type {?}
     * @private
     */
    MatKeyboardService.prototype._live;
    /**
     * @type {?}
     * @private
     */
    MatKeyboardService.prototype._defaultLocale;
    /**
     * @type {?}
     * @private
     */
    MatKeyboardService.prototype._layouts;
    /**
     * @type {?}
     * @private
     */
    MatKeyboardService.prototype._parentKeyboard;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neDctbWF0ZXJpYWwta2V5Ym9hcmQvIiwic291cmNlcyI6WyJzZXJ2aWNlcy9rZXlib2FyZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQWMsTUFBTSxzQkFBc0IsQ0FBQztBQUMxRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdEQsT0FBTyxFQUFnQixNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRWhHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSwrREFBK0QsQ0FBQztBQUM5RyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNqRixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUsxRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQzs7OztBQU12RixNQUFNLE9BQU8sa0JBQWtCOzs7Ozs7OztJQWdDN0IsWUFBb0IsUUFBaUIsRUFDakIsS0FBb0IsRUFDRCxjQUFzQixFQUNYLFFBQTBCLEVBQ2hDLGVBQW1DO1FBSjNELGFBQVEsR0FBUixRQUFRLENBQVM7UUFDakIsVUFBSyxHQUFMLEtBQUssQ0FBZTtRQUNELG1CQUFjLEdBQWQsY0FBYyxDQUFRO1FBQ1gsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFDaEMsb0JBQWUsR0FBZixlQUFlLENBQW9COzs7Ozs7UUE5QnZFLDRCQUF1QixHQUFnRCxJQUFJLENBQUM7UUFFNUUsc0JBQWlCLEdBQWUsRUFBRSxD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TyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxDQUFDOzs7WUFyTUYsVUFBVTs7OztZQWpCRixPQUFPO1lBRFAsYUFBYTt5Q0FxRFAsTUFBTSxTQUFDLFNBQVM7NENBQ2hCLE1BQU0sU0FBQyxvQkFBb0I7WUFDcUIsa0JBQWtCLHVCQUFsRSxRQUFRLFlBQUksUUFBUTs7Ozs7Ozs7OztJQTlCakMscURBQW9GOzs7OztJQUVwRiwrQ0FBMkM7Ozs7O0lBd0IvQixzQ0FBeUI7Ozs7O0lBQ3pCLG1DQUE0Qjs7Ozs7SUFDNUIsNENBQWlEOzs7OztJQUNqRCxzQ0FBZ0U7Ozs7O0lBQ2hFLDZDQUFtRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExpdmVBbm5vdW5jZXIgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XHJcbmltcG9ydCB7IE92ZXJsYXksIE92ZXJsYXlDb25maWcsIE92ZXJsYXlSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XHJcbmltcG9ydCB7IENvbXBvbmVudFBvcnRhbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xyXG5pbXBvcnQgeyBDb21wb25lbnRSZWYsIEluamVjdCwgSW5qZWN0YWJsZSwgTE9DQUxFX0lELCBPcHRpb25hbCwgU2tpcFNlbGYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IE1hdEtleWJvYXJkUmVmIH0gZnJvbSAnLi4vY2xhc3Nlcy9rZXlib2FyZC1yZWYuY2xhc3MnO1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZENvbnRhaW5lckNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMva2V5Ym9hcmQtY29udGFpbmVyL2tleWJvYXJkLWNvbnRhaW5lci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZENvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMva2V5Ym9hcmQva2V5Ym9hcmQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTUFUX0tFWUJPQVJEX0xBWU9VVFMgfSBmcm9tICcuLi9jb25maWdzL2tleWJvYXJkLWxheW91dHMuY29uZmlnJztcclxuaW1wb3J0IHsgTWF0S2V5Ym9hcmRDb25maWcgfSBmcm9tICcuLi9jb25maWdzL2tleWJvYXJkLmNvbmZpZyc7XHJcbmltcG9ydCB7IElLZXlib2FyZExheW91dCB9IGZyb20gJy4uL2ludGVyZmFjZXMva2V5Ym9hcmQtbGF5b3V0LmludGVyZmFjZSc7XHJcbmltcG9ydCB7IElLZXlib2FyZExheW91dHMgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2tleWJvYXJkLWxheW91dHMuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgSUxvY2FsZU1hcCB9IGZyb20gJy4uL2ludGVyZmFjZXMvbG9jYWxlLW1hcC5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBfYXBwbHlBdmFpbGFibGVMYXlvdXRzLCBfYXBwbHlDb25maWdEZWZhdWx0cyB9IGZyb20gJy4uL3V0aWxzL2tleWJvYXJkLnV0aWxzJztcclxuXHJcbi8qKlxyXG4gKiBTZXJ2aWNlIHRvIGRpc3BhdGNoIE1hdGVyaWFsIERlc2lnbiBrZXlib2FyZC5cclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIE1hdEtleWJvYXJkU2VydmljZSB7XHJcbiAgLyoqXHJcbiAgICogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50IGtleWJvYXJkIGluIHRoZSB2aWV3ICphdCB0aGlzIGxldmVsKiAoaW4gdGhlIEFuZ3VsYXIgaW5qZWN0b3IgdHJlZSkuXHJcbiAgICogSWYgdGhlcmUgaXMgYSBwYXJlbnQga2V5Ym9hcmQgc2VydmljZSwgYWxsIG9wZXJhdGlvbnMgc2hvdWxkIGRlbGVnYXRlIHRvIHRoYXQgcGFyZW50XHJcbiAgICogdmlhIGBfb3BlbmVkS2V5Ym9hcmRSZWZgLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2tleWJvYXJkUmVmQXRUaGlzTGV2ZWw6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PiB8IG51bGwgPSBudWxsO1xyXG5cclxuICBwcml2YXRlIF9hdmFpbGFibGVMb2NhbGVzOiBJTG9jYWxlTWFwID0ge307XHJcblxyXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnRseSBvcGVuZWQga2V5Ym9hcmQgYXQgKmFueSogbGV2ZWwuICovXHJcbiAgcHJpdmF0ZSBnZXQgX29wZW5lZEtleWJvYXJkUmVmKCk6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PiB8IG51bGwge1xyXG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50S2V5Ym9hcmQ7XHJcbiAgICByZXR1cm4gcGFyZW50ID8gcGFyZW50Ll9vcGVuZWRLZXlib2FyZFJlZiA6IHRoaXMuX2tleWJvYXJkUmVmQXRUaGlzTGV2ZWw7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldCBfb3BlbmVkS2V5Ym9hcmRSZWYodmFsdWU6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50Pikge1xyXG4gICAgaWYgKHRoaXMuX3BhcmVudEtleWJvYXJkKSB7XHJcbiAgICAgIHRoaXMuX3BhcmVudEtleWJvYXJkLl9vcGVuZWRLZXlib2FyZFJlZiA9IHZhbHVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fa2V5Ym9hcmRSZWZBdFRoaXNMZXZlbCA9IHZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IGF2YWlsYWJsZUxvY2FsZXMoKTogSUxvY2FsZU1hcCB7XHJcbiAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlTG9jYWxlcztcclxuICB9XHJcblxyXG4gIGdldCBpc09wZW5lZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAhIXRoaXMuX29wZW5lZEtleWJvYXJkUmVmO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcclxuICAgICAgICAgICAgICBwcml2YXRlIF9saXZlOiBMaXZlQW5ub3VuY2VyLFxyXG4gICAgICAgICAgICAgIEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIF9kZWZhdWx0TG9jYWxlOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfS0VZQk9BUkRfTEFZT1VUUykgcHJpdmF0ZSBfbGF5b3V0czogSUtleWJvYXJkTGF5b3V0cyxcclxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBwcml2YXRlIF9wYXJlbnRLZXlib2FyZDogTWF0S2V5Ym9hcmRTZXJ2aWNlKSB7XHJcbiAgICAvLyBwcmVwYXJlIGF2YWlsYWJsZSBsYXlvdXRzIG1hcHBpbmdcclxuICAgIHRoaXMuX2F2YWlsYWJsZUxvY2FsZXMgPSBfYXBwbHlBdmFpbGFibGVMYXlvdXRzKF9sYXlvdXRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW5kIGRpc3BhdGNoZXMgYSBrZXlib2FyZCB3aXRoIGEgY3VzdG9tIGNvbXBvbmVudCBmb3IgdGhlIGNvbnRlbnQsIHJlbW92aW5nIGFueVxyXG4gICAqIGN1cnJlbnRseSBvcGVuZWQga2V5Ym9hcmRzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGxheW91dE9yTG9jYWxlIGxheW91dCBvciBsb2NhbGUgdG8gdXNlLlxyXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgY29uZmlndXJhdGlvbiBmb3IgdGhlIGtleWJvYXJkLlxyXG4gICAqL1xyXG4gIG9wZW5Gcm9tQ29tcG9uZW50KGxheW91dE9yTG9jYWxlOiBzdHJpbmcsIGNvbmZpZzogTWF0S2V5Ym9hcmRDb25maWcpOiBNYXRLZXlib2FyZFJlZjxNYXRLZXlib2FyZENvbXBvbmVudD4ge1xyXG4gICAgY29uc3Qga2V5Ym9hcmRSZWY6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PiA9IHRoaXMuX2F0dGFjaEtleWJvYXJkQ29udGVudChjb25maWcpO1xyXG5cclxuICAgIGtleWJvYXJkUmVmLmluc3RhbmNlLmRhcmtUaGVtZSA9IGNvbmZpZy5kYXJrVGhlbWU7XHJcbiAgICBrZXlib2FyZFJlZi5pbnN0YW5jZS5pc0RlYnVnID0gY29uZmlnLmlzRGVidWc7XHJcblxyXG4gICAgLy8gYSBsb2NhbGUgaXMgcHJvdmlkZWRcclxuICAgIGlmICh0aGlzLmF2YWlsYWJsZUxvY2FsZXNbbGF5b3V0T3JMb2NhbGVdKSB7XHJcbiAgICAgIGtleWJvYXJkUmVmLmluc3RhbmNlLmxvY2FsZSA9IGxheW91dE9yTG9jYWxlO1xyXG4gICAgICBrZXlib2FyZFJlZi5pbnN0YW5jZS5sYXlvdXQgPSB0aGlzLmdldExheW91dEZvckxvY2FsZShsYXlvdXRPckxvY2FsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYSBsYXlvdXQgbmFtZSBpcyBwcm92aWRlZFxyXG4gICAgaWYgKHRoaXMuX2xheW91dHNbbGF5b3V0T3JMb2NhbGVdKSB7XHJcbiAgICAgIGtleWJvYXJkUmVmLmluc3RhbmNlLmxheW91dCA9IHRoaXMuX2xheW91dHNbbGF5b3V0T3JMb2NhbGVdO1xyXG4gICAgICBrZXlib2FyZFJlZi5pbnN0YW5jZS5sb2NhbGUgPSB0aGlzLl9sYXlvdXRzW2xheW91dE9yTG9jYWxlXS5sYW5nICYmIHRoaXMuX2xheW91dHNbbGF5b3V0T3JMb2NhbGVdLmxhbmcucG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gV2hlbiB0aGUga2V5Ym9hcmQgaXMgZGlzbWlzc2VkLCBsb3dlciB0aGUga2V5Ym9hcmQgY291bnRlci5cclxuICAgIGtleWJvYXJkUmVmXHJcbiAgICAgIC5hZnRlckRpc21pc3NlZCgpXHJcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgIC8vIENsZWFyIHRoZSBrZXlib2FyZCByZWYgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiByZXBsYWNlZCBieSBhIG5ld2VyIGtleWJvYXJkLlxyXG4gICAgICAgIGlmICh0aGlzLl9vcGVuZWRLZXlib2FyZFJlZiA9PT0ga2V5Ym9hcmRSZWYpIHtcclxuICAgICAgICAgIHRoaXMuX29wZW5lZEtleWJvYXJkUmVmID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIGlmICh0aGlzLl9vcGVuZWRLZXlib2FyZFJlZikge1xyXG4gICAgICAvLyBJZiBhIGtleWJvYXJkIGlzIGFscmVhZHkgaW4gdmlldywgZGlzbWlzcyBpdCBhbmQgZW50ZXIgdGhlXHJcbiAgICAgIC8vIG5ldyBrZXlib2FyZCBhZnRlciBleGl0IGFuaW1hdGlvbiBpcyBjb21wbGV0ZS5cclxuICAgICAgdGhpcy5fb3BlbmVkS2V5Ym9hcmRSZWZcclxuICAgICAgICAuYWZ0ZXJEaXNtaXNzZWQoKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAga2V5Ym9hcmRSZWYuY29udGFpbmVySW5zdGFuY2UuZW50ZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgdGhpcy5fb3BlbmVkS2V5Ym9hcmRSZWYuZGlzbWlzcygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gSWYgbm8ga2V5Ym9hcmQgaXMgaW4gdmlldywgZW50ZXIgdGhlIG5ldyBrZXlib2FyZC5cclxuICAgICAga2V5Ym9hcmRSZWYuY29udGFpbmVySW5zdGFuY2UuZW50ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJZiBhIGRpc21pc3MgdGltZW91dCBpcyBwcm92aWRlZCwgc2V0IHVwIGRpc21pc3MgYmFzZWQgb24gYWZ0ZXIgdGhlIGtleWJvYXJkIGlzIG9wZW5lZC5cclxuICAgIC8vIGlmIChjb25maWdzLmR1cmF0aW9uID4gMCkge1xyXG4gICAgLy8gICBrZXlib2FyZFJlZi5hZnRlck9wZW5lZCgpLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAvLyAgICAgc2V0VGltZW91dCgoKSA9PiBrZXlib2FyZFJlZi5kaXNtaXNzKCksIGNvbmZpZ3MuZHVyYXRpb24pO1xyXG4gICAgLy8gICB9KTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBpZiAoY29uZmlnLmFubm91bmNlbWVudE1lc3NhZ2UpIHtcclxuICAgICAgdGhpcy5fbGl2ZS5hbm5vdW5jZShjb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSwgY29uZmlnLnBvbGl0ZW5lc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX29wZW5lZEtleWJvYXJkUmVmID0ga2V5Ym9hcmRSZWY7XHJcbiAgICByZXR1cm4gdGhpcy5fb3BlbmVkS2V5Ym9hcmRSZWY7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPcGVucyBhIGtleWJvYXJkIHdpdGggYSBtZXNzYWdlIGFuZCBhbiBvcHRpb25hbCBhY3Rpb24uXHJcbiAgICogQHBhcmFtIGxheW91dE9yTG9jYWxlIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgbG9jYWxlIG9yIHRoZSBsYXlvdXQgbmFtZSB0byBiZSB1c2VkLlxyXG4gICAqIEBwYXJhbSBjb25maWcgQWRkaXRpb25hbCBjb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIHRoZSBrZXlib2FyZC5cclxuICAgKi9cclxuICBvcGVuKGxheW91dE9yTG9jYWxlOiBzdHJpbmcgPSB0aGlzLl9kZWZhdWx0TG9jYWxlLCBjb25maWc6IE1hdEtleWJvYXJkQ29uZmlnID0ge30pOiBNYXRLZXlib2FyZFJlZjxNYXRLZXlib2FyZENvbXBvbmVudD4ge1xyXG4gICAgY29uc3QgX2NvbmZpZyA9IF9hcHBseUNvbmZpZ0RlZmF1bHRzKGNvbmZpZyk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMub3BlbkZyb21Db21wb25lbnQobGF5b3V0T3JMb2NhbGUsIF9jb25maWcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGlzbWlzc2VzIHRoZSBjdXJyZW50bHktdmlzaWJsZSBrZXlib2FyZC5cclxuICAgKi9cclxuICBkaXNtaXNzKCkge1xyXG4gICAgaWYgKHRoaXMuX29wZW5lZEtleWJvYXJkUmVmKSB7XHJcbiAgICAgIHRoaXMuX29wZW5lZEtleWJvYXJkUmVmLmRpc21pc3MoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1hcCBhIGdpdmVuIGxvY2FsZSB0byBhIGxheW91dCBuYW1lLlxyXG4gICAqIEBwYXJhbSBsb2NhbGUgVGhlIGxheW91dCBuYW1lXHJcbiAgICovXHJcbiAgbWFwTG9jYWxlKGxvY2FsZTogc3RyaW5nID0gdGhpcy5fZGVmYXVsdExvY2FsZSk6IHN0cmluZyB7XHJcbiAgICBsZXQgbGF5b3V0OiBzdHJpbmc7XHJcbiAgICBjb25zdCBjb3VudHJ5ID0gbG9jYWxlXHJcbiAgICAgIC5zcGxpdCgnLScpXHJcbiAgICAgIC5zaGlmdCgpO1xyXG5cclxuICAgIC8vIHNlYXJjaCBmb3IgbGF5b3V0IG1hdGNoaW5nIHRoZVxyXG4gICAgLy8gZmlyc3QgcGFydCwgdGhlIGNvdW50cnkgY29kZVxyXG4gICAgaWYgKHRoaXMuYXZhaWxhYmxlTG9jYWxlc1tjb3VudHJ5XSkge1xyXG4gICAgICBsYXlvdXQgPSB0aGlzLmF2YWlsYWJsZUxvY2FsZXNbbG9jYWxlXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBsb29rIGlmIHRoZSBkZXRhaWxlZCBsb2NhbGUgbWF0Y2hlcyBhbnkgbGF5b3V0XHJcbiAgICBpZiAodGhpcy5hdmFpbGFibGVMb2NhbGVzW2xvY2FsZV0pIHtcclxuICAgICAgbGF5b3V0ID0gdGhpcy5hdmFpbGFibGVMb2NhbGVzW2xvY2FsZV07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFsYXlvdXQpIHtcclxuICAgICAgdGhyb3cgRXJyb3IoYE5vIGxheW91dCBmb3VuZCBmb3IgbG9jYWxlICR7bG9jYWxlfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBsYXlvdXQ7XHJcbiAgfVxyXG5cclxuICBnZXRMYXlvdXRGb3JMb2NhbGUobG9jYWxlOiBzdHJpbmcpOiBJS2V5Ym9hcmRMYXlvdXQge1xyXG4gICAgcmV0dXJuIHRoaXMuX2xheW91dHNbdGhpcy5tYXBMb2NhbGUobG9jYWxlKV07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBdHRhY2hlcyB0aGUga2V5Ym9hcmQgY29udGFpbmVyIGNvbXBvbmVudCB0byB0aGUgb3ZlcmxheS5cclxuICAgKi9cclxuICBwcml2YXRlIF9hdHRhY2hLZXlib2FyZENvbnRhaW5lcihvdmVybGF5UmVmOiBPdmVybGF5UmVmLCBjb25maWc6IE1hdEtleWJvYXJkQ29uZmlnKTogTWF0S2V5Ym9hcmRDb250YWluZXJDb21wb25lbnQge1xyXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChNYXRLZXlib2FyZENvbnRhaW5lckNvbXBvbmVudCwgY29uZmlnLnZpZXdDb250YWluZXJSZWYpO1xyXG4gICAgY29uc3QgY29udGFpbmVyUmVmOiBDb21wb25lbnRSZWY8TWF0S2V5Ym9hcmRDb250YWluZXJDb21wb25lbnQ+ID0gb3ZlcmxheVJlZi5hdHRhY2goY29udGFpbmVyUG9ydGFsKTtcclxuXHJcbiAgICAvLyBzZXQgY29uZmlnXHJcbiAgICBjb250YWluZXJSZWYuaW5zdGFuY2Uua2V5Ym9hcmRDb25maWcgPSBjb25maWc7XHJcblxyXG4gICAgcmV0dXJuIGNvbnRhaW5lclJlZi5pbnN0YW5jZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBsYWNlcyBhIG5ldyBjb21wb25lbnQgYXMgdGhlIGNvbnRlbnQgb2YgdGhlIGtleWJvYXJkIGNvbnRhaW5lci5cclxuICAgKi9cclxuICBwcml2YXRlIF9hdHRhY2hLZXlib2FyZENvbnRlbnQoY29uZmlnOiBNYXRLZXlib2FyZENvbmZpZyk6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PiB7XHJcbiAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5fY3JlYXRlT3ZlcmxheSgpO1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fYXR0YWNoS2V5Ym9hcmRDb250YWluZXIob3ZlcmxheVJlZiwgY29uZmlnKTtcclxuICAgIGNvbnN0IHBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoTWF0S2V5Ym9hcmRDb21wb25lbnQpO1xyXG4gICAgY29uc3QgY29udGVudFJlZiA9IGNvbnRhaW5lci5hdHRhY2hDb21wb25lbnRQb3J0YWwocG9ydGFsKTtcclxuICAgIHJldHVybiBuZXcgTWF0S2V5Ym9hcmRSZWYoY29udGVudFJlZi5pbnN0YW5jZSwgY29udGFpbmVyLCBvdmVybGF5UmVmKSBhcyBNYXRLZXlib2FyZFJlZjxNYXRLZXlib2FyZENvbXBvbmVudD47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbmV3IG92ZXJsYXkgYW5kIHBsYWNlcyBpdCBpbiB0aGUgY29ycmVjdCBsb2NhdGlvbi5cclxuICAgKi9cclxuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KCk6IE92ZXJsYXlSZWYge1xyXG4gICAgY29uc3Qgc3RhdGUgPSBuZXcgT3ZlcmxheUNvbmZpZyh7XHJcbiAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgIH0pO1xyXG5cclxuICAgIHN0YXRlLnBvc2l0aW9uU3RyYXRlZ3kgPSB0aGlzLl9vdmVybGF5XHJcbiAgICAgIC5wb3NpdGlvbigpXHJcbiAgICAgIC5nbG9iYWwoKVxyXG4gICAgICAuY2VudGVySG9yaXpvbnRhbGx5KClcclxuICAgICAgLmJvdHRvbSgnMCcpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLl9vdmVybGF5LmNyZWF0ZShzdGF0ZSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==