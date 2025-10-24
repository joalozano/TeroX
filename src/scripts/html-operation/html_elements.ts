export function setAttrs(element: HTMLElement, attrs: { [key: string]: string }): void {
    Object.keys(attrs).forEach((key: string) => {
        if (attrs[key] !== undefined) {
            element.setAttribute(key, attrs[key] as string);
        }
    });
}
