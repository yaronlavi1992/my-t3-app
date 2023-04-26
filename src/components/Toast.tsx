import React, { useEffect } from 'react'
// import { toast, ToastContainer } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';

export const Toast = ({text, duration = 3000, ...rest}: any) => {
  useEffect(() => {
    toast(text, {duration});
  
    // return () => {}
  }, [])
  
  return (
    // <ToastContainer {...rest} />
    <Toaster {...rest} />
  )
}
