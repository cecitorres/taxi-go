import {
    useToast
} from "primevue/usetoast";

export default function () {
    const toast = useToast();
    const addErrorToast = (summary, detail) => {
        toast.add({
            severity: "error",
            summary,
            detail,
            life: 5000
        });
    }
    return {
        addErrorToast
    }
}