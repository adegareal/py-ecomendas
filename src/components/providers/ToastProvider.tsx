import { Toaster } from "react-hot-toast";

function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "16px",
          background: "#0f172a",
          color: "#fff",
        },
      }}
    />
  );
}

export default ToastProvider;