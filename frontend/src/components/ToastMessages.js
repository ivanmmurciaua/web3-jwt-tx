import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function pointsSucessfullyIncremented() {
    toast.success('Points incremented!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}

export function sucessfullyRegister() {
    toast.success('You are sucessfully registered! Enjoy 😎', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}
  
export function pointsNotIncremented() {
    toast.error('Ups, something happened!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });           
}
  
export function notRegistered() {
    toast.error('Ups! It seems you need to register again!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}
  
export function expiredToken() {
    toast.error('Ups! It seems that your token is expired! Please connect your wallet to renew it', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }); 
}
  
export function invalidToken() {
    toast.error('Ups! It seems that your token is invalid! Please connect your wallet to renew it', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}
  
export function pointsRetrieved(points) {
    toast.info(`You have ${points} points`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });              
}