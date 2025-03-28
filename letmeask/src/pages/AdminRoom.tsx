import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import { Button } from '../components/Button';
import { useParams, useHistory } from 'react-router-dom'


import '../styles/room.scss';
import { RoomCode } from '../components/RoomCode';

import { Question } from '../components/Question/index';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

type RoomParams = {
    id: string;
}


export function AdminRoom() {
    // const { user } = useAuth();
    const params = useParams<RoomParams>();
    // const [newQuestion, setNewQuestion] = useState('');
    const roomId = params.id;

    const history = useHistory()

    const { title, questions } = useRoom(roomId);

    console.log(questions)

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que deseja excluir essa pergunta ? ')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {

        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });

    }

    async function handleHightLightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        });
    }


    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button onClick={handleEndRoom} isOutlined={true}>Encerrar a sala</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHightLightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Responder pergunta" />
                                        </button>
                                    </>
                                    )}
                                <button
                                    type=
                                    "button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}  //Algoritmo derecociliação;