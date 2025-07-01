import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { useEffect } from "react";
import { initializeUserId } from "../redux/slice/userSlice";
import type { RootState } from "../redux/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-fox-toast";
import Home from "./pages/Home";
import NotFoundPage from "./pages/404/NotFound";
import NotesCanvas from "./pages/NoteCanvas";

function App() {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    if (!userId) {
      dispatch(initializeUserId());
    }
  }, [userId, dispatch]);
  return (
    <div>
      <ToastContainer />
      <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/canvas" element={<NotesCanvas />} />
            <Route path="*" element={<NotFoundPage />} />
          {/* Home route */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
