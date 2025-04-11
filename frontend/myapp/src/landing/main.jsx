import Navbar from "./navbar"
import Home from "./home"
import Contact from "./contact"
import FooterSection from "./footer"

function Main(){
    return(
        <div>
            <Navbar></Navbar>
            <Home></Home>
            <Contact></Contact>
            <FooterSection></FooterSection>
        </div>
    )
}
export default Main