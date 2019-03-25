import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { NavLink } from "react-router-dom"; 
import { Button } from "yoda-design-system";

const Navigation = (props) => {
    return(
        <div style={{padding: "2%"}}>
            <Navbar bg="dark" variant="dark" fixed="top">
                <Navbar.Brand><img src="favicon.ico" width="30" height="30" alt="Solid logo"/></Navbar.Brand>
                <Nav className="mr-auto">
                    <NavLink to="/">Profile</NavLink>
                </Nav>
                <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button>Search</Button>
                </Form>
            </Navbar>
        </div>
    );
};

export default Navigation; 