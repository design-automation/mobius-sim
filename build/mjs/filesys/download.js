/**
 * Download a file.
 * @param data
 * @param filename
 */
export function download(data, filename) {
    // console.log('Downloading');
    const file = new File([data], filename, { type: 'plain/text;charset=utf-8' });
    // console.log(file.name);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(file);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWJzL2ZpbGVzeXMvZG93bmxvYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxRQUFRLENBQUMsSUFBWSxFQUFFLFFBQWdCO0lBQ25ELDhCQUE4QjtJQUU5QixNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSwwQkFBMEIsRUFBRSxDQUFDLENBQUM7SUFDOUUsMEJBQTBCO0lBRTFCLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekMsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUN6QixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFYixPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDIn0=