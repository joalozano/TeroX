export function getFormByID(id: string): HTMLFormElement {
    return document.getElementById(id) as HTMLFormElement;
}

export function getElementByID(id: string): HTMLElement {
    return document.getElementById(id) as HTMLElement;
}

export function getElementsByClass(buttons: string) {
    return document.getElementsByClassName(buttons) as HTMLCollectionOf<HTMLElement>;
}
