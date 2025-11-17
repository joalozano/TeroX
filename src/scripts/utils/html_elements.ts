export function setAttrs(element: HTMLElement, attrs: { [key: string]: string | boolean }): void {
    Object.keys(attrs).forEach((key: string) => {
        if (attrs[key] !== undefined) {
            element.setAttribute(key, attrs[key] as string);
        }
    });
}
