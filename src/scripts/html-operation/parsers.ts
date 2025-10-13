export function formToDict(form: HTMLFormElement) {
    const formData = new FormData(form); // FormData maneja inputs + archivos
    // pero para usarlo en el backend necesitamos un paquete como multer
    const data: { [key: string]: string; } = {};
    formData.forEach((value, key) => { 
        data[key] = value.toString();
    });
    return data;
}