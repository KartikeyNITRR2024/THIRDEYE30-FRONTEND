import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

export default function Home() {
    const [loadingToastId, setLoadingToastId] = useState(null);

    const [num, setNum] = useState({
        code: -1,
        message: ""
    });

    useEffect(() => {
        if (num.code === 0) {
            notify1();
        } else if (num.code === 1) {
            notify2(num.message);
            setNum({ code: -1, message: "" });
        } else if (num.code === 2) {
            notify3(num.message);
            setNum({ code: -1, message: "" });
        } else {
            toast.dismiss();
        }
    }, [num]);

    const notify1 = () => {
        const id = toast.loading("Loading...", { position: "top-center" });
        setLoadingToastId(id);
    };

    const notify2 = (message) => {
        if (loadingToastId) {
            toast.update(loadingToastId, {
                render: message,
                type: "success",
                isLoading: false,
                autoClose: 1500,
            });
        }
    };

    const notify3 = (message) => {
        if (loadingToastId) {
            toast.update(loadingToastId, {
                render: message,
                type: "error",
                isLoading: false,
                autoClose: 1500,
            });
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold my-20">React Toastify Example</h1>
            <div>number is {num.code}</div>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => { setNum({ code: 0, message: "" }) }}
            >
                Show Toast
            </button>
            <button
                className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => { setNum({ code: 1, message: "Completed!" }) }}
            >
                Success Toast
            </button>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => { setNum({ code: 2, message: "Not Completed!" }) }}
            >
                Failure Toast
            </button>
            <button
                className="bg-yellow-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => { setNum({ code: -1, message: "" })}}
            >
                Stop now
            </button>
            <ToastContainer />
        </div>
    );
}
