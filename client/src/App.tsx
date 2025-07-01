import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { useEffect } from "react";
import { initializeUserId } from "../redux/slice/userSlice";
import type { RootState } from "../redux/store"; 


function App() {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.userId);
  useEffect(() => {
    if (!userId) {
      dispatch(initializeUserId());
    }
  }, [userId, dispatch]);
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </>
  );
}

export default App;
