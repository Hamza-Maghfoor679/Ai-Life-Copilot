export interface IntentionModalProps {
  visible: boolean;
  onClose: () => void;
  plannedDuration: number | null;
  difficulty: string | null;
  notes: string;
  onSetIntention: () => void;
  onDurationChange: (duration: number) => void;
  onDifficultyChange: (difficulty: string) => void;
  onNotesChange: (text: string) => void;
  loading?: boolean
}