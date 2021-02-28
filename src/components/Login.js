import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import { useHistory, BrowserRouter as Router, Route } from "react-router-dom";
import Student from "../Student";
import Teacher from "../Teacher";
import axios from 'axios';
import Cookies from 'universal-cookie';


function Content() {
  let history = useHistory();
  const [user_name, setUserName] = useState("");
  const [password, setPassword] = useState("");

  async function handleClick() {
    if(!validateForm()){
      alert("Check Username and Password");
      return;
    }
    var response = await call();
    console.log("response : " + JSON.stringify(response));

    if (response) {
      history.push("/" + response.toLowerCase());
    }
    //history.push("/app");
  }

  async function call() {

    var page;
    var myMap = new Map();
    myMap.set("user_name", user_name);
    myMap.set("password", password);

    await axios({
      method: 'post',
      url: 'https://java2021.azurewebsites.net/v1/login',
      data: Object.fromEntries(myMap),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(function (response) {
        //handle success
        //alert(JSON.stringify(response.data));
        console.log(response.data);
        console.log(response.data['status']);

        //res = JSON.stringify(response.data);
        if (response.data['status'] !== 'OK') {
          alert(JSON.stringify(response.data['error']));
          page = null;
        } else {
          page = response.data["type"];
        }
      })
      .catch(function (response) {
        //handle error
        alert(response);
        console.log(response);
        page = null;
      });
    return page;
  };



  function validateForm() {
    return password.length > 0 && user_name.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  function setUserCredential(event){
    const cookies = new Cookies();
    cookies.set('user_name', user_name, { path: '/' });
    setPassword(event.target.value);
  }


  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group size="sm" controlId="text">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="inputtext"
            value={user_name}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="sm" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setUserCredential(e)}
          />
        </Form.Group>
        <Button block size="lg" type="submit" onClick={handleClick}>
          Login
        </Button>
      </Form>
    </div>
  );
}

function Login() {
  return (
    <Router>
      <Route path="/student" exact component={() => <Student user_name={new Cookies().get('user_name')} />} />
      <Route path="/teacher" exact component={() => <Teacher user_name={new Cookies().get('user_name')} />} />
      <Route path="/login" exact component={Content} />
    </Router>
  );
}

export default Login;