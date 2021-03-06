import "./App.scss";
import Homepage from "./pages/homepage";
import Detail from "./pages/detail";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header.js";
import Footer from "./components/Footer/Footer.js";
import Watch from "./pages/watch";
import Search from "./pages/search";
import TypePage from "./pages/type";
import TrendingPage from "./pages/top";
// import { useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
// import Actor from "./components/HoriScroll/Actor/Actor";
import ActorPage from "./pages/actor/index";
import AuthPage from "./pages/authPage";
import { useEffect } from "react";
import { auth, onAuthStateChanged } from "./config/firebase";
import { login, logout } from "./redux/reducers/userReducer";
import { useDispatch } from "react-redux";
import LogoutPage from "./pages/logout";
import { addUser, getUser } from "./database/firestore";

function App() {
  // const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        // user is logged in, send the user's details to redux, store the current user in the state
        const user = await getUser(userAuth.uid);

        if (user) {
          dispatch(login(user));
          addUser(user);
        }
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Header />
        <Routes>
          {/* Homepage */}
          <Route exact path="/" element={<Homepage />}></Route>

          {/* Detail page */}
          <Route path=":mediaType/detail/:id" element={<Detail />}></Route>
          <Route
            path=":mediaType/detail/:id/season/:season_id"
            element={<Detail />}
          ></Route>

          {/* Watch page */}
          <Route path="/watch/:mediaType/:id" element={<Watch />}></Route>

          {/* Search page */}
          <Route path="/search" element={<Search />}></Route>

          {/* Type page */}
          <Route path="/type/:mediaType" element={<TypePage />}></Route>

          {/* Hot page */}
          <Route path="/top" element={<TrendingPage />}></Route>

          {/* Actor page */}
          <Route path="/actor/:id" element={<ActorPage />}></Route>

          {/* Login page */}
          <Route path="/login" element={<AuthPage />}></Route>
          <Route path="/signup" element={<AuthPage />}></Route>
          <Route path="/resetPassword" element={<AuthPage />}></Route>
          {/* SignUp page */}

          {/* Logout page */}
          <Route path="/logout" element={<LogoutPage />}></Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
