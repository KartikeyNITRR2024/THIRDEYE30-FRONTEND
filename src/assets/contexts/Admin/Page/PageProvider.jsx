import { useState, useEffect, useContext } from "react";
import PageContext from "./PageContext";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Auth/AuthContext";


export default function PageProvider({ children }) {
  
  const [page, setPage] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const updatePage =  (pageNo) => {
      setPage(pageNo);
  };

  const resetPage = () => {
      setPage(null);
  }

  useEffect(() => {
      if (!login) {
        setPage(null);
        navigate("/");
      }
  }, [login]);


  
  return (
    <PageContext.Provider
      value={{ page, updatePage, resetPage }}
    >
      {children}
    </PageContext.Provider>
  );
}

