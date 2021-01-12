import { store } from 'react-notifications-component';

const notify = (type: 'success' | 'danger', message?: string) => {

    store.addNotification({
      title: type === 'success' ? 'Success!' : 'Error!',
      message: message || (
        type === 'success'
          ? 'Operation succesfully completed.'
          : 'Operation failed, Please contact support for assistance.'
      ),
      type,
      insert: "top",
      container: "bottom-right",
      animationIn: ["animate__animated", "animate__bounceIn"],
      animationOut: ["animate__animated", "animate__fadeOutDown"],
      dismiss: {
        duration: 10000,
        onScreen: true,
        pauseOnHover: true
      },
    });
  }

  export default notify