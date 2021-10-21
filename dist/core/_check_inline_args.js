/**
 *
 * @param fn_name
 * @param args
 * @param expected
 */
export function checkNumArgs(fn_name, args, max, min) {
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
/**
 *
 * @param fn_name
 * @param args
 */
export function checkListsSameLen(fn_name, args) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NoZWNrX2lubGluZV9hcmdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvcmUvX2NoZWNrX2lubGluZV9hcmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxPQUFlLEVBQUUsSUFBZ0IsRUFBRSxHQUFXLEVBQUUsR0FBWTtJQUNyRixJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUc7UUFDcEIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQ1gsbUJBQW1CLEdBQUcsT0FBTyxHQUFHLGtDQUFrQztnQkFDbEUsc0NBQXNDLEdBQUcsR0FBRyxHQUFHLElBQUk7Z0JBQ25ELE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsd0JBQXdCO2dCQUNyRCwwQ0FBMEMsR0FBRyxPQUFPLEdBQUcsZUFBZSxDQUN6RSxDQUFDO1NBQ0w7S0FDSjtTQUFNO1FBQ0gsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUU7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FDWCxtQkFBbUIsR0FBRyxPQUFPLEdBQUcsMkJBQTJCO2dCQUMzRCxxQ0FBcUMsR0FBRyxHQUFHLEdBQUcsSUFBSTtnQkFDbEQsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyx3QkFBd0I7Z0JBQ3JELDBDQUEwQyxHQUFHLE9BQU8sR0FBRyxlQUFlLENBQ3pFLENBQUM7U0FDTDtRQUNELElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQ1gsbUJBQW1CLEdBQUcsT0FBTyxHQUFHLDBCQUEwQjtnQkFDMUQscUNBQXFDLEdBQUcsR0FBRyxHQUFHLElBQUk7Z0JBQ2xELE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcseUJBQXlCO2dCQUN0RCwwQ0FBMEMsR0FBRyxPQUFPLEdBQUcsZUFBZSxDQUN6RSxDQUFDO1NBQ0w7S0FDSjtBQUNMLENBQUM7QUFDRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLGlCQUFpQixDQUFDLE9BQWUsRUFBRSxJQUFnQjtJQUMvRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUNYLG1CQUFtQixHQUFHLE9BQU8sR0FBRywwQkFBMEI7Z0JBQzFELG1DQUFtQztnQkFDbkMsd0NBQXdDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLDBDQUEwQyxHQUFHLE9BQU8sR0FBRyxlQUFlLENBQ3pFLENBQUM7U0FDTDtRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNQLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUNuQyxNQUFNLElBQUksS0FBSyxDQUNYLG1CQUFtQixHQUFHLE9BQU8sR0FBRywwQkFBMEI7b0JBQzFELHNEQUFzRDtvQkFDdEQsMEVBQTBFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BHLDBDQUEwQyxHQUFHLE9BQU8sR0FBRyxlQUFlLENBQ3pFLENBQUM7YUFDTDtTQUNKO0tBQ0o7QUFDTCxDQUFDIn0=