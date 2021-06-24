import { useParams, useHistory } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss'
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>()
  const roomId = params.id
  const { questions, title } = useRoom(roomId)
  const history = useHistory()

  async function handleDeleteQuestion(questionId: string){
    if(window.confirm('Tem certeza que deseja excluir esta pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleEndRoom(){
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    });

    history.push(`/`)
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />

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
            return (
              <Question
                author={question.author}
                key={question.id}
                content={question.content}
              >
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
