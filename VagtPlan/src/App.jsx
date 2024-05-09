import { Calendar } from "./Calendar";
import "./styles.css";
import {ToastContainer} from "react-toastify";

export default function App() {
    return (
        <div className="App">
            <Calendar />
            <ToastContainer />
        </div>
    );
}
