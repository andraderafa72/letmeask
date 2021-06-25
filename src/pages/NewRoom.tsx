import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/auth.scss';

export function NewRoom() {
  const [newRoom, setNewRoom] = useState('')
  const [hasAnswers, setHasAnswers] = useState(false)
  const { user } = useAuth()
  const history = useHistory()

  async function handleCreateRoom(event: FormEvent){
    event.preventDefault()

    if(newRoom.trim() === '') return

    const roomRef = database.ref('rooms');

    const firabaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
      hasAnswers: hasAnswers,
    });

    history.push(`/rooms/${firabaseRoom.key}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as duvidas da sua audiência em tempo real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              value={newRoom}
              onChange={e => setNewRoom(e.target.value)}
              placeholder="Nome da sala"
            />

            <div className="has-answers">
              <input type="checkbox" checked={hasAnswers} onChange={e => setHasAnswers(!hasAnswers)} name="has-answers" id="" />
              <span>Habilitar respostas no app</span>
            </div>
            <Button type="submit">Criar sala</Button>
          </form>
          <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
        </div>
      </main>
    </div>
  )
}
