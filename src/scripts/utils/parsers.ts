export function formToDict(form: HTMLFormElement) {
    const formData = new FormData(form);
    const data: { [key: string]: string; } = {};
    formData.forEach((value, key) => {
        data[key] = value?.toString();
    });
    return data;
}
