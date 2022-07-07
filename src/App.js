import { BrowserRouter as Router, Switch, Route , Redirect} from "react-router-dom";
import Login from "./components/Auth/Login";

import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";

import { AuthProvider,AuthContext } from "./components/Auth/Auth";
import Navbar from "./layout/Navbar";

import Home from "./components/pages/Notify";
import Message from "./components/pages/Message";
import Report from "./components/pages/Report";
import Profile from "./components/pages/Profile";
import Crime from "./components/pages/Crime";
import Direction from "./components/pages/ViewDirection";

import './styles/Home.scss'


const NavRoute = ({ exact, path, component: Component }) => (
    <Route exact={exact} path={path} render={(props) => (
        <>
            <Navbar />
            <div className="pages">
                <div className="container">
                    <Component {...props}/>
                </div>
            </div>
        </>
    )}/>
)


function App() {
    return (
        <AuthProvider>
            <Router>
                <Switch>
                    <NavRoute exact path="/" component={Home}  />
                    <NavRoute exact path="/accident" component={Report}  />
                    <NavRoute exact path="/crime" component={Crime}  />
                    <NavRoute exact path="/message" component={Message}  />
                    <NavRoute exact path="/profile" component={Profile}  />
                    <NavRoute path="/viewDirection/" component={Direction}  />

                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/forgot_password" component={ForgotPassword} />
                </Switch>
            </Router>
        </AuthProvider>
    );
}

export default App;
