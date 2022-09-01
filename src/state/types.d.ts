interface Passage {
  vChord: VoicedChord;
  // timing
  index: number;
  duration: Duration;
}

type Sequence = Passage[];

interface PublicState {
  // Serialized
  sequence: Sequence;
  bpm: number;
  title: string;
  issue?: number;
}

interface State extends PublicState {
  // ↓ Not serialized = lost on page refresh ↓

  // UX state
  isPlaying: boolean;
  isMuted: boolean;
  isSharing: boolean;
  isHelped: boolean;
  inputFocus: boolean; // if true, focus in on a HTML input and key strokes should not be managed by app
  keyFocus: KeyFocus;
  isAddNewCell: boolean; // '+' cell that does not contain any chord

  // Grid and chord state
  beatLength: number;
  currentCellIndex: number; // highlighted in edit mode or active in playing mode
  beat: number;
  beatInPassage: number;

  // Derived
  currentKeys: ScaleKey[];
  currentVChord: VoicedChord;
  nextKeys: ScaleKey[];
  nextVChord: VoicedChord;
  serializedSequence: string;
  link: string;
}

interface Action {
  type: ActionType;
  vChord?: VoicedChord;
  payload?: number;
  title?: string;
  dispatch?: Dispatch;
}

type Reducer = (state: State, action: Action) => State;
type Dispatch = (action: Action) => void;

interface Serializer {
  [key: string]: string;
}