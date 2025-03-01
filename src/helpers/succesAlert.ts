import Swal from 'sweetalert2'

export const successAlert = async (message: string) => {
     return Swal.fire({
      title: message,
      icon: "success",
      draggable: true
    });
  }

export const errorAlert = async (message: string) => {
    return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
        footer: '<a href="#">Why do I have this issue?</a>'
      });
 }


export const secureAlert = async (message: string) => {
        return Swal.fire({
        title: message,
        showDenyButton: true,
        confirmButtonText: "Eliminar",
        denyButtonText: `Cancelar`
    });
}