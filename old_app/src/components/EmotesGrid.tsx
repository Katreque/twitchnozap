import {
    IonGrid,
    IonCol,
    IonRow,
    IonImg
} from '@ionic/react';
import './EmotesGrid.css';

interface Props {
    type: number;
}

/*function getEmotes(type: number): Array<any> {
    const emotes = [];
    const path = type ? '/assets/emotes/animated/' : '/assets/emotes/static/';



    return emotes;
}*/

const EmotesGrid: React.FC<Props> = ({ type }) => {
    return (
        <div className='ion-margin-top'>
            <IonGrid>
                <IonRow>
                    <IonImg src='/assets/emotes/animated/BOOBA.webp' />
                    <IonCol>2</IonCol>
                    <IonCol>3</IonCol>
                </IonRow>
            </IonGrid>
        </div>
    );
};

export default EmotesGrid;