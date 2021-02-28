import React, { Component } from 'react';
import quizQuestions from './api/quizQuestions';
import Button from 'react-bootstrap/Button';
import { CSSTransitionGroup } from 'react-transition-group';
import './Teacher.css';
import axios from 'axios';
import DatePicker from 'react-date-picker';


class Teacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionId: 1,
      question: '',
      answerA: '',
      answerB: '',
      answerC: '',
      answerD: '',
      allQuestion: [],
      startDate: new Date(),
      endDate: new Date()
    };

  }

  componentDidMount() {
    var asd = {
      question: "Test Question",
      question_uniqe_id: '0',
      quiz_name: "TURKISH",
      answers: [
        {
          content: "Test"
        },
        {
          content: "Test"
        },
        {
          content: "Test"
        },
        {
          content: "Test"
        }
      ]
    };

    quizQuestions.push(asd);
  }

  nextQuestionClick = () => {

console.log(JSON.stringify(this.state.allQuestion));

    if (!this.validateForm()) {
      alert("Fill of All Fields!");
      return;
    }

    var myMap = new Map();

    myMap.set("question", this.state.question);
    myMap.set("answerA", this.state.answerA);
    myMap.set("answerB", this.state.answerB);
    myMap.set("answerC", this.state.answerC);
    myMap.set("answerD", this.state.answerD);
    myMap.set("startDate", this.state.startDate);
    myMap.set("endDate", this.state.endDate);

    this.setState((state, props) => ({
      question: '',
      answerA: '',
      answerB: '',
      answerC: '',
      answerD: '',
      allQuestion: [
        ...state.allQuestion,
        Object.fromEntries(myMap)
      ],
    }));

  }
  saveQuestionsClick = async () => {
    //alert(this.state.answerA);

    if (this.state.allQuestion.length === 0) {
      alert("Can Not Find Data To Save!");
      return;
    }

    await axios({
      method: 'post',
      url: 'http://java2021.azurewebsites.net/v1/exams/save',
      //data: Object.fromEntries(myMap),
      data: JSON.stringify(this.state.allQuestion),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(function (response) {
        console.log(response.data);
        if (response.data['status'] === 'OK') {
          alert("Successfull!");
        }else{
          alert(response.data['error']);
        }  
      })
      .catch(function (response) {
        //handle error
        alert(response);
        console.log(response);
      });

    this.setState({ allQuestion: [] });

  }
  handleChangeQuestion = e => {
    this.setState({ question: e.target.value });
  };

  handleChangeA = e => {
    this.setState({ answerA: e.target.value });
  };

  handleChangeB = e => {
    this.setState({ answerB: e.target.value });

  };

  handleChangeC = e => {
    this.setState({ answerC: e.target.value });
  };

  handleChangeD = e => {
    this.setState({ answerD: e.target.value });
  };

  handleChangeStartDate = date => {
    console.log(date)
    this.setState({ startDate: date });
    console.log(this.state.startDate);
  };

  handleChangeEndDate = date => {
    this.setState({ endDate: date });
  };


  validateForm = () => {
    return this.state.question.length > 0 && this.state.answerA.length > 0
      && this.state.answerB.length > 0 && this.state.answerB.length > 0 && this.state.answerD.length > 0
      && this.state.startDate && this.state.endDate;
  }

  renderQuiz() {
    return (
      <CSSTransitionGroup
        className="container"
        component="div"
        transitionName="fade"
        transitionEnterTimeout={800}
        transitionLeaveTimeout={500}
        transitionAppear
        transitionAppearTimeout={500}
      >
        <div key={this.state.questionId}>
          <form>
            <p>Enter Question:</p>
            <input id="question" type="text" value={this.state.question} onChange={(e) => { this.handleChangeQuestion(e) }}
            />
          </form>

          <li className="answerOption">
            <form>
              <p>Enter Answer A:</p>
              <input id="answerA" type="text" value={this.state.answerA} onChange={(e) => { this.handleChangeA(e) }}
              />
              <p>Enter Answer B:</p>
              <input id="answerB" type="text" value={this.state.answerB} onChange={(e) => { this.handleChangeB(e) }}
              />
              <p>Enter Answer C:</p>
              <input id="answerC" type="text" value={this.state.answerC} onChange={(e) => { this.handleChangeC(e) }}
              />
              <p>Enter Answer D:</p>
              <input id="answerD" type="text" value={this.state.answerD} onChange={(e) => { this.handleChangeD(e) }}
              />
            </form>
          </li>
        </div>
      </CSSTransitionGroup>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Prepare Quiz</h2>
        </div>

        <form>
          <div className="form-date-input">
            <p>Enter Start Date:</p>
            <DatePicker value={this.state.startDate} onChange={date => { this.handleChangeStartDate(date)}}
            />
            <p>Enter End Date</p>
            <DatePicker value={this.state.endDate} onChange={date => { this.handleChangeEndDate(date) }}
            />

          </div>

        </form>
        {this.renderQuiz()}
        <div className="button-1">
          <Button
            onClick={this.nextQuestionClick}
          >
            Click to Next Question
          </Button>

        </div>
        <div className="button-2">
          <Button

            onClick={this.saveQuestionsClick}
          >
            Click to Save Questions
          </Button>
        </div>
      </div>
    );
  }
}

export default Teacher;

