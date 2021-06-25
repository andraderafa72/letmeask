import { ReactNode, useState } from 'react'

import cx from 'classnames';
import './styles.scss';
import { Button } from '../Button';

type QuestionProps = {
  content: string;
  answer?: string;
  author: {
    name: string;
    avatar: string;
  }
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
  isAnswering?: boolean;
  setAnswerFunction?: (answer: string) => void;
}

export function Question({ content, answer, author, isHighlighted = false, isAnswered = false, isAnswering = false, setAnswerFunction = () => { }, children }: QuestionProps) {
  const [newAnswer, setNewAnswer] = useState('')



  return (
    <div
      className={cx(
        'question',
        { answered: isAnswered && !answer },
        { highlighted: isHighlighted && !isAnswered },
      )}
    >
      <p>{content}</p>

      { answer && (
        <div className="answer">
          <span>Resposta</span>
          <p>{answer}</p>
        </div>
        )}

      {isAnswering && (
        <form onSubmit={e => {
          e.preventDefault()
          setAnswerFunction(newAnswer)
        }}>
          <textarea
            value={newAnswer}
            onChange={e => setNewAnswer(e.target.value)}
            placeholder="Resposta"
          />

          <Button type="submit">Responder</Button>
        </form>
      )}

      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  )
}
