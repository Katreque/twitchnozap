import { 
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
} from '@ionic/react';
import EmotesGrid from '../components/EmotesGrid';

import './Tab1.css';

const Tab1: React.FC = () => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Static Emotes</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonToolbar>
					<div className='ion-margin'>
						<IonSearchbar animated={true} placeholder="Emote Name"></IonSearchbar>
						<EmotesGrid type={0}/>
					</div>
				</IonToolbar>
			</IonContent>
		</IonPage>
	);
};

export default Tab1;
