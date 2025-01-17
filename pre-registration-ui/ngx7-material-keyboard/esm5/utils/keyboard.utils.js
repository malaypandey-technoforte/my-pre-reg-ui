/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { MatKeyboardConfig } from '../configs/keyboard.config';
/**
 * Applies default options to the keyboard configs.
 * @param {?} config The configuration to which the defaults will be applied.
 * @return {?} The new configuration object with defaults applied.
 */
export function _applyConfigDefaults(config) {
    return Object.assign(new MatKeyboardConfig(), config);
}
/**
 * Applies available layouts.
 * @param {?} layouts
 * @return {?}
 */
export function _applyAvailableLayouts(layouts) {
    /** @type {?} */
    var _availableLocales = {};
    Object
        .keys(layouts)
        .filter(function (layout) { return 'lang' in layouts[layout]; })
        .forEach(function (layout) {
        layouts[layout].lang.forEach(function (lang) {
            _availableLocales[lang] = layout;
        });
    });
    return _availableLocales;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQudXRpbHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3g3LW1hdGVyaWFsLWtleWJvYXJkLyIsInNvdXJjZXMiOlsidXRpbHMva2V5Ym9hcmQudXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDOzs7Ozs7QUFTL0QsTUFBTSxVQUFVLG9CQUFvQixDQUFDLE1BQXlCO0lBQzVELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEQsQ0FBQzs7Ozs7O0FBTUQsTUFBTSxVQUFVLHNCQUFzQixDQUFDLE9BQXlCOztRQUN4RCxpQkFBaUIsR0FBZSxFQUFFO0lBRXhDLE1BQU07U0FDSCxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ2IsTUFBTSxDQUFDLFVBQUMsTUFBYyxJQUFLLE9BQUEsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBekIsQ0FBeUIsQ0FBQztTQUNyRCxPQUFPLENBQUMsVUFBQyxNQUFjO1FBQ3RCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBWTtZQUN4QyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVMLE9BQU8saUJBQWlCLENBQUM7QUFDM0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdEtleWJvYXJkQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlncy9rZXlib2FyZC5jb25maWcnO1xyXG5pbXBvcnQgeyBJS2V5Ym9hcmRMYXlvdXRzIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9rZXlib2FyZC1sYXlvdXRzLmludGVyZmFjZSc7XHJcbmltcG9ydCB7IElMb2NhbGVNYXAgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2xvY2FsZS1tYXAuaW50ZXJmYWNlJztcclxuXHJcbi8qKlxyXG4gKiBBcHBsaWVzIGRlZmF1bHQgb3B0aW9ucyB0byB0aGUga2V5Ym9hcmQgY29uZmlncy5cclxuICogQHBhcmFtIGNvbmZpZyBUaGUgY29uZmlndXJhdGlvbiB0byB3aGljaCB0aGUgZGVmYXVsdHMgd2lsbCBiZSBhcHBsaWVkLlxyXG4gKiBAcmV0dXJucyBUaGUgbmV3IGNvbmZpZ3VyYXRpb24gb2JqZWN0IHdpdGggZGVmYXVsdHMgYXBwbGllZC5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfYXBwbHlDb25maWdEZWZhdWx0cyhjb25maWc6IE1hdEtleWJvYXJkQ29uZmlnKTogTWF0S2V5Ym9hcmRDb25maWcge1xyXG4gIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyBNYXRLZXlib2FyZENvbmZpZygpLCBjb25maWcpO1xyXG59XHJcblxyXG4vKipcclxuICogQXBwbGllcyBhdmFpbGFibGUgbGF5b3V0cy5cclxuICogQHBhcmFtIGxheW91dHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfYXBwbHlBdmFpbGFibGVMYXlvdXRzKGxheW91dHM6IElLZXlib2FyZExheW91dHMpOiBJTG9jYWxlTWFwIHtcclxuICBjb25zdCBfYXZhaWxhYmxlTG9jYWxlczogSUxvY2FsZU1hcCA9IHt9O1xyXG5cclxuICBPYmplY3RcclxuICAgIC5rZXlzKGxheW91dHMpXHJcbiAgICAuZmlsdGVyKChsYXlvdXQ6IHN0cmluZykgPT4gJ2xhbmcnIGluIGxheW91dHNbbGF5b3V0XSlcclxuICAgIC5mb3JFYWNoKChsYXlvdXQ6IHN0cmluZykgPT4ge1xyXG4gICAgICBsYXlvdXRzW2xheW91dF0ubGFuZy5mb3JFYWNoKChsYW5nOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBfYXZhaWxhYmxlTG9jYWxlc1tsYW5nXSA9IGxheW91dDtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgcmV0dXJuIF9hdmFpbGFibGVMb2NhbGVzO1xyXG59XHJcbiJdfQ==