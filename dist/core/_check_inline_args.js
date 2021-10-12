"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkListsSameLen = exports.checkNumArgs = void 0;
/**
 *
 * @param fn_name
 * @param args
 * @param expected
 */
function checkNumArgs(fn_name, args, max, min) {
    if (min === undefined) {
        if (args.length !== (max + 1)) {
            throw new Error('Inline function "' + fn_name + '()": wrong number of arguments. ' +
                'The required number of arguments is ' + max + '. ' +
                'but ' + (args.length - 1) + ' arguments were given.' +
                'Please check the documentation for the "' + fn_name + '()" function.');
        }
    }
    else {
        if (args.length > max + 1) {
            throw new Error('Inline function "' + fn_name + '()": too many arguments. ' +
                'The maximum number of arguments is ' + max + '. ' +
                'but ' + (args.length - 1) + ' arguments were given.' +
                'Please check the documentation for the "' + fn_name + '()" function.');
        }
        if (args.length < min + 1) {
            throw new Error('Inline function "' + fn_name + '()": too few arguments. ' +
                'The minimum number of arguments is ' + max + '. ' +
                'but ' + (args.length - 1) + ' arguments were given. ' +
                'Please check the documentation for the "' + fn_name + '()" function.');
        }
    }
}
exports.checkNumArgs = checkNumArgs;
/**
 *
 * @param fn_name
 * @param args
 */
function checkListsSameLen(fn_name, args) {
    for (let i = 1; i < args.length; i++) {
        if (!Array.isArray(args[i])) {
            throw new Error('Inline function "' + fn_name + '()": invalid arguments. ' +
                'The arguments must all be lists. ' +
                'The following argument is not a list: ' + JSON.stringify(args[i]) +
                'Please check the documentation for the "' + fn_name + '()" function.');
        }
        if (i > 1) {
            if (args[1].length !== args[i].length) {
                throw new Error('Inline function "' + fn_name + '()": invalid arguments. ' +
                    'The arguments must all be lists of the same length. ' +
                    'The following argument has a length that does not match the first list: ' + JSON.stringify(args[i]) +
                    'Please check the documentation for the "' + fn_name + '()" function.');
            }
        }
    }
}
exports.checkListsSameLen = checkListsSameLen;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NoZWNrX2lubGluZV9hcmdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvcmUvX2NoZWNrX2lubGluZV9hcmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBOzs7OztHQUtHO0FBQ0gsU0FBZ0IsWUFBWSxDQUFDLE9BQWUsRUFBRSxJQUFnQixFQUFFLEdBQVcsRUFBRSxHQUFZO0lBQ3JGLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRztRQUNwQixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FDWCxtQkFBbUIsR0FBRyxPQUFPLEdBQUcsa0NBQWtDO2dCQUNsRSxzQ0FBc0MsR0FBRyxHQUFHLEdBQUcsSUFBSTtnQkFDbkQsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyx3QkFBd0I7Z0JBQ3JELDBDQUEwQyxHQUFHLE9BQU8sR0FBRyxlQUFlLENBQ3pFLENBQUM7U0FDTDtLQUNKO1NBQU07UUFDSCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFBRTtZQUN2QixNQUFNLElBQUksS0FBSyxDQUNYLG1CQUFtQixHQUFHLE9BQU8sR0FBRywyQkFBMkI7Z0JBQzNELHFDQUFxQyxHQUFHLEdBQUcsR0FBRyxJQUFJO2dCQUNsRCxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLHdCQUF3QjtnQkFDckQsMENBQTBDLEdBQUcsT0FBTyxHQUFHLGVBQWUsQ0FDekUsQ0FBQztTQUNMO1FBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUU7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FDWCxtQkFBbUIsR0FBRyxPQUFPLEdBQUcsMEJBQTBCO2dCQUMxRCxxQ0FBcUMsR0FBRyxHQUFHLEdBQUcsSUFBSTtnQkFDbEQsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyx5QkFBeUI7Z0JBQ3RELDBDQUEwQyxHQUFHLE9BQU8sR0FBRyxlQUFlLENBQ3pFLENBQUM7U0FDTDtLQUNKO0FBQ0wsQ0FBQztBQTVCRCxvQ0E0QkM7QUFDRDs7OztHQUlHO0FBQ0gsU0FBZ0IsaUJBQWlCLENBQUMsT0FBZSxFQUFFLElBQWdCO0lBQy9ELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQ1gsbUJBQW1CLEdBQUcsT0FBTyxHQUFHLDBCQUEwQjtnQkFDMUQsbUNBQW1DO2dCQUNuQyx3Q0FBd0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsMENBQTBDLEdBQUcsT0FBTyxHQUFHLGVBQWUsQ0FDekUsQ0FBQztTQUNMO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ1AsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ25DLE1BQU0sSUFBSSxLQUFLLENBQ1gsbUJBQW1CLEdBQUcsT0FBTyxHQUFHLDBCQUEwQjtvQkFDMUQsc0RBQXNEO29CQUN0RCwwRUFBMEUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEcsMENBQTBDLEdBQUcsT0FBTyxHQUFHLGVBQWUsQ0FDekUsQ0FBQzthQUNMO1NBQ0o7S0FDSjtBQUNMLENBQUM7QUFyQkQsOENBcUJDIn0=