import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Auth from "./components/Auth/Auth";
import PrivateComponent from "./components/PrivateComponent";
import Welcome from "./components/WelcomePage/Welcome";
import CreateGroup from "./components/CreateGroup/CreateGroup";
import "./App.css";
import { useSelector } from "react-redux";
import { useChat } from "./context/ChatContext";
import JoinGroup from "./components/JoinGroup/JoinGroup";
import { styled, useMediaQuery } from "@mui/material";
import { MaterialDesignContent, SnackbarProvider } from "notistack";

const Home = lazy(() => import("./components/Home/Home"));

function App() {
  const darkTheme = useSelector((state) => state.darkMode);
  const isMobile = useMediaQuery("(max-width: 800px)");
  const { selectedChat } = useChat();

  const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
		'&.notistack-MuiContent-success': {
			backgroundColor: '#26B56A',
		},
		'&.notistack-MuiContent-error': {
			backgroundColor: '#970C0C',
		},
	}));

  return (
    <SnackbarProvider
      autoHideDuration={2000}
      maxSnack={3}
      Components={{
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
      }}
    >
      <BrowserRouter>
        <Routes>

          <Route element={<PrivateComponent />}>
            <Route path="/welcome" element={
              <div id="AppContainer" className={darkTheme ? "dark-container" : ""}>
                <div className={isMobile ? "App-mobile-view" : "App"}>

                  <div id="left-panel" className={darkTheme ? "dark-panel" : ""}>
                    <Sidebar />
                  </div>

                  {!isMobile && <div id="welcome-panel" className={darkTheme ? "dark-panel" : ""}>
                    <Welcome />
                  </div>}

                </div>
              </div>
            } />
          </Route>

          <Route element={<PrivateComponent />}>
            <Route path="/chat" element={
              <div id="AppContainer" className={darkTheme ? "dark-container" : ""}>
                <div className={isMobile ? "App-mobile-view" : "App"}>

                  {!isMobile &&
                    <div id="left-panel" className={darkTheme ? "dark-panel" : ""}>
                      <Sidebar />
                    </div>
                  }

                  {selectedChat ?
                    <div id="right-panel" className={darkTheme ? "dark-panel" : ""}>
                      <Suspense fallback={<p>Loading messages...</p>}>
                        <Home />
                      </Suspense>
                    </div>
                    :
                    (!isMobile ?
                      <div id="welcome-panel" className={darkTheme ? "dark-panel" : ""}>
                        <Welcome />
                      </div> :
                      <div id="left-panel" className={darkTheme ? "dark-panel" : ""}>
                        <Sidebar />
                      </div>
                    )
                  }

                </div>
              </div>
            } />
          </Route>

          <Route element={<PrivateComponent />}>
            <Route path="/create" element={
              <div id="AppContainer" className={darkTheme ? "dark-container" : ""}>
                <div className={isMobile ? "App-mobile-view" : "App"}>

                  {!isMobile &&
                    <div id="left-panel" className={darkTheme ? "dark-panel" : ""}>
                      <Sidebar />
                    </div>
                  }

                  <div id="welcome-panel" className={darkTheme ? "dark-panel" : ""}>
                    <CreateGroup />
                  </div>

                </div>
              </div>
            } />
          </Route>

          <Route element={<PrivateComponent />}>
            <Route path="/join" element={
              <div id="AppContainer" className={darkTheme ? "dark-container" : ""}>
                <div className={isMobile ? "App-mobile-view" : "App"}>

                  {!isMobile &&
                    <div id="left-panel" className={darkTheme ? "dark-panel" : ""}>
                      <Sidebar />
                    </div>
                  }

                  <div id="welcome-panel" className={darkTheme ? "dark-panel" : ""}>
                    <JoinGroup />
                  </div>

                </div>
              </div>
            } />
          </Route>

          <Route path="/" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
