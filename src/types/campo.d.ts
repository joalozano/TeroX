declare global {
    interface Campo {
        label: string;
        attr: {
            type: string;
            id: string;
            name: string;
            required: string;
            autocomplete: string;
            placeholder: string;
        }
        textContent : string
    }
}

export{}