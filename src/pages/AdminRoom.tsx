import { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import cx from 'classnames';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';

import toast, { Toaster } from 'react-hot-toast'

import '../styles/room.scss'
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>()
  const roomId = params.id
  const { questions, title, hasAnswers } = useRoom(roomId)
  const history = useHistory()
  const [isAnswering ,setIsAnswering] = useState(false)
  const [questionIdToAnswer, setQuestionIdToAnswer] = useState<string>()
  const {user} = useAuth();

  async function handleDeleteQuestion(questionId: string) {
    const { authorId } = await (await database.ref(`rooms/${roomId}`).get()).val()
    if(!user || authorId !== user.id) return history.push(`/rooms/${roomId}`)


    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }

    toast.error('Pergunta apagada!')
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    const { authorId } = await (await database.ref(`rooms/${roomId}`).get()).val()
    if(!user || authorId !== user.id) return history.push(`/rooms/${roomId}`)

    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    })

    toast.error('Pergunta respondida!')
  }

  async function handleSetAnswer(answer: string){
    const { authorId } = await (await database.ref(`rooms/${roomId}`).get()).val()
    if(!user || authorId !== user.id) return history.push(`/rooms/${roomId}`)

    await database.ref(`rooms/${roomId}/questions/${questionIdToAnswer}`).update({
      isAnswered: true,
      answer: answer,
    });
    setIsAnswering(false)
    toast.success('Pergunta respondida!')
  }

  async function HandleSwitchHighlightQuestion(questionId: string, isHighlighted: boolean) {
    const { authorId } = await (await database.ref(`rooms/${roomId}`).get()).val()
    if(!user || authorId !== user.id) return history.push(`/rooms/${roomId}`)

    if (isHighlighted) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: false
      });

      if(hasAnswers){
        setIsAnswering(false)
        setQuestionIdToAnswer('')
      }
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true
      })

      if(hasAnswers){
        setQuestionIdToAnswer(questionId)
        setIsAnswering(true)
      }
    }
  }

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    });

    history.push(`/`)
  }

  return (
    <div id="page-room">
      <div><Toaster/></div>
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" onClick={e => history.push('/')}/>

          <div>
            <RoomCode code={roomId} />

            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>

          {questions.length > 0 && (
            <span>{questions.length} pergunta(s)</span>
          )}
        </div>

        <section className="question-list">
          {questions.map(question => {
            console.log(question)
            return (
              <Question
                author={question.author}
                key={question.id}
                content={question.content}
                isAnswered={question.isAnswered}
                isHighlighted={!hasAnswers && question.isHighlighted}
                isAnswering={questionIdToAnswer === question.id && isAnswering}
                setAnswerFunction={handleSetAnswer}
                answer={question.answer}
              >
                {!question.isAnswered && (
                  <>
                  { !hasAnswers && (
                    <button
                      className="like-button"
                      type="button"
                      aria-label="marcar como gostei"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>
                  )}
                    <button
                      className={cx(
                        "like-button",
                        { highlightedIcon: question.isHighlighted && isAnswering }
                        )}
                      type="button"
                      aria-label="marcar como gostei"
                      onClick={() => HandleSwitchHighlightQuestion(question.id, question.isHighlighted)}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </>
                )}
                <button
                  className="like-button"
                  type="button"
                  aria-label="marcar como gostei"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>

              </Question>
            );
          })}
        </section>
      </main>
    </div>
  )
}
