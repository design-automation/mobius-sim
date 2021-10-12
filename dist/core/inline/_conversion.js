"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numToCurr = exports.numToStr = exports.degToRad = exports.radToDeg = void 0;
const _check_inline_args_1 = require("../_check_inline_args");
/**
 * Converts radians to degrees.
 *
 * @param rad
 */
function radToDeg(debug, rad) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('radToDeg', arguments, 1);
    }
    if (Array.isArray(rad)) {
        return rad.map(a_rad => radToDeg(debug, a_rad));
    }
    return rad * (180 / Math.PI);
}
exports.radToDeg = radToDeg;
/**
 * Converts degrees to radians.
 *
 * @param deg
 */
function degToRad(debug, deg) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('degToRad', arguments, 1);
    }
    if (Array.isArray(deg)) {
        return deg.map(a_deg => degToRad(debug, a_deg));
    }
    return deg * (Math.PI / 180);
}
exports.degToRad = degToRad;
/**
 * Converts the number to a string, with commas, e.g. 1,234,567
 * Converts the number to a string, with commas, where "d" specifies the number of fraction digits, e.g. 1,234.00.
 * Converts the number to a string, where "d" specifies the number of fraction digits, and "l" specifies the locale, e.g. "en-GB", "fi-FI", "in-IN", "pt-BR", etc'
 *
 * @param num
 * @param frac_digits
 * @param locale
 */
function numToStr(debug, num, frac_digits, locale) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('numToStr', arguments, 3, 1);
    }
    if (Array.isArray(num)) {
        for (let i = 0; i < num.length; i++) {
            num[i] = typeof num === 'number' ? num : Number(num);
        }
    }
    else {
        num = typeof num === 'number' ? num : Number(num);
    }
    const options = {};
    if (frac_digits !== undefined) {
        options['maximumFractionDigits'] = frac_digits;
        options['minimumFractionDigits'] = frac_digits;
    }
    locale = locale === undefined ? 'en-GB' : locale;
    if (Array.isArray(num)) {
        return num.map(a_num => a_num.toLocaleString(locale, options));
    }
    return num.toLocaleString(locale, options);
}
exports.numToStr = numToStr;
/**
 * Converts the number to a string representing currency.
 *
 * @param num
 * @param currency
 * @param locale
 */
function numToCurr(debug, num, currency, locale) {
    if (debug) {
        (0, _check_inline_args_1.checkNumArgs)('numToCurr', arguments, 3, 2);
    }
    if (Array.isArray(num)) {
        for (let i = 0; i < num.length; i++) {
            num[i] = typeof num === 'number' ? num : Number(num);
        }
    }
    else {
        num = typeof num === 'number' ? num : Number(num);
    }
    const options = {};
    options['style'] = 'currency';
    options['currency'] = currency;
    locale = locale === undefined ? 'en-GB' : locale;
    if (Array.isArray(num)) {
        return num.map(a_num => a_num.toLocaleString(locale, options));
    }
    return num.toLocaleString(locale, options);
}
exports.numToCurr = numToCurr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NvbnZlcnNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29yZS9pbmxpbmUvX2NvbnZlcnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQXFEO0FBRXJEOzs7O0dBSUc7QUFDSCxTQUFnQixRQUFRLENBQUMsS0FBYyxFQUFFLEdBQW9CO0lBQ3pELElBQUksS0FBSyxFQUFFO1FBQ1AsSUFBQSxpQ0FBWSxFQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDMUM7SUFDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFhLENBQUM7S0FBRTtJQUN4RixPQUFPLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakMsQ0FBQztBQU5ELDRCQU1DO0FBQ0Q7Ozs7R0FJRztBQUNILFNBQWdCLFFBQVEsQ0FBQyxLQUFjLEVBQUUsR0FBb0I7SUFDekQsSUFBSSxLQUFLLEVBQUU7UUFDUCxJQUFBLGlDQUFZLEVBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMxQztJQUNELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUFFLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQWEsQ0FBQztLQUFFO0lBQ3hGLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBTkQsNEJBTUM7QUFDRDs7Ozs7Ozs7R0FRRztBQUNILFNBQWdCLFFBQVEsQ0FBQyxLQUFj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