import React, { Component } from 'react';
import quizQuestions from './api/quizQuestions';
import Quiz from './components/Quiz';
import Result from './components/Result';
import './App.css';
import axios from 'axios';


class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: props.user_name,
      counter: 0,
      questionId: 1,
      question: '',
      question_uniqe_id: '',
      quiz_name: '',
      answerOptions: [],
      answer: '',
      answersCount: {},
      result: '',
      allAnswer: { "username": props.user_name }
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
  }

  async componentDidMount() {

    await this.getQuestions();

    
    const shuffledAnswerOptions = quizQuestions.map(question =>
      this.shuffleArray(question.answers)
    );
    this.setState({
      question: quizQuestions[0].question,
      question_uniqe_id: quizQuestions[0].question_uniqe_id,
      quiz_name: quizQuestions[0].quiz_name,
      answerOptions: shuffledAnswerOptions[0]
    });
  }

  getQuestions = async () => {

    //quizQuestions.unshift();

    var d = new Date();

    var datestring = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    var url = 'http://java2021.azurewebsites.net/v1/exams/get/date/'+datestring+'/user/' + this.state.user_name;
    console.log(url);

    await axios({
      method: 'get',
      url: url,
      //data: Object.fromEntries(myMap),
      //data: JSON.stringify(this.state.allAnswer),
      data: '',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(function (response) {

        //console.log(response.data['status']);
        //console.log(response.data[1]);
        var list = [];
        list = response.data;
        var x = 0;
        list.forEach(element => {
          var myMap = new Map();
          myMap = element;
          var question = '';
          var choice_1 = '';
          var choice_2 = '';
          var choice_3 = '';
          var choice_4 = '';
          var exam_id = '';
          for (const [key, value] of Object.entries(myMap)) {
            //console.log(key, value);
            if (key === 'question') {
              question = value;
            } else if (key === 'choice_1') {
              choice_1 = value;
            } else if (key === 'choice_2') {
              choice_2 = value;
            } else if (key === 'choice_3') {
              choice_3 = value;
            } else if (key === 'choice_4') {
              choice_4 = value;
            } else if (key === 'exam_id') {
              exam_id = value;
            }
          }

          var data = {
            question: question,
            question_uniqe_id: x,
            quiz_name: exam_id,
            answers: [
              {
                content: choice_1
              },
              {
                content: choice_2
              },
              {
                content: choice_3
              },
              {
                content: choice_4
              }
            ]
          };

          console.log("---->",data);

          quizQuestions.push(data);
          
          x++;

        });
      })
      .catch(function (response) {
        //handle error
        alert(response);
        console.log(response);
      });
  }

  shuffleArray(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  async handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);

    if (this.state.questionId < quizQuestions.length) {
      setTimeout(() => this.setNextQuestion(), 300);
    } else {
      setTimeout(() => this.setResults(this.getResults()), 300);
    }
  }

  setUserAnswer(answer) {
    this.setState((state, props) => ({
      answersCount: {
        ...state.answersCount,
        [answer]: (state.answersCount[answer] || 0) + 1
      },
      answer: answer,

      allAnswer: {
        ...state.allAnswer,
        [state.question]: answer
      },


    }));
    //console.log(" *** Set Answer1 *** ->", this.state.allAnswer);
    //console.log(" *** Set Answer2 *** ->", Object.keys(this.state.allAnswer));
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;

    this.setState({
      counter: counter,
      questionId: questionId,
      question: quizQuestions[counter].question,
      question_uniqe_id: quizQuestions[counter].question_uniqe_id,
      answerOptions: quizQuestions[counter].answers,
      quiz_name : quizQuestions[counter].quiz_name,
      answer: ''
    });
  }

  async getResults() {
    this.setState((state, props) => ({
      allAnswer: {
        ...state.allAnswer,
        "quiz_name": state.quiz_name
      },
    }));

    await axios({
      method: 'post',
      url: 'http://java2021.azurewebsites.net/v1/answer/save',
      //data: Object.fromEntries(myMap),
      data: JSON.stringify(this.state.allAnswer),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(function (response) {
        //handle success
        //alert(JSON.stringify(response.data));
        console.log(response.data);
        console.log(response.data['status']);


      })
      .catch(function (response) {
        //handle error
        alert(response);
        console.log(response);
      });

    return 'OK';
  }

  setResults(result) {
    if (result.length === 1) {
      this.setState({ result: result[0] });
    } else {
      this.setState({ result: 'Undetermined' });
    }
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderResult() {
    return <Result quizResult={this.state.user_name} quiz_name={this.state.quiz_name} />;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Quiz</h2>
        </div>
        {this.state.result ? this.renderResult() : this.renderQuiz()}
      </div>
    );
  }
}

export default Student;
