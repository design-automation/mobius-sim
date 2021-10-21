import { checkNumArgs } from '../_check_inline_args';
/**
 * Maps a number from the d1 domain to the d2 domain.
 * @param num
 * @param d1
 * @param d2
 */
export function remap(debug, num, d1, d2) {
    if (debug) {
        checkNumArgs('remap', arguments, 3);
    }
    if (Array.isArray(num)) {
        return num.map(num_val => remap(debug, num_val, d1, d2));
    }
    return (d2[0] +
        (((num - d1[0]) / (d1[1] - d1[0])) * (d2[1] - d2[0])));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2FyaXRobWV0aWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29yZS9pbmxpbmUvX2FyaXRobWV0aWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRXJEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLEtBQUssQ0FBQyxLQUFjLEVBQUUsR0FBb0IsRUFBRSxFQUFZLEVBQUUsRUFBWTtJQUNsRixJQUFJLEtBQUssRUFBRTtRQUNQLFlBQVksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3ZDO0lBQ0QsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQUUsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFhLENBQUM7S0FBRTtJQUNqRyxPQUFPLENBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNWLENBQ0ksQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUN0RCxDQUNKLENBQUM7QUFDTixDQUFDIn0=