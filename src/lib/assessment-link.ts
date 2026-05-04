export const AI_MATCH_TALLY_FORM_ID = "xXNXNr";

export const AI_MATCH_TALLY_POPUP_HREF =
  `#tally-open=${AI_MATCH_TALLY_FORM_ID}&tally-width=500&tally-hide-title=1&tally-overlay=1&tally-emoji-text=%F0%9F%A4%96&tally-emoji-animation=flash`;

type TallyPopupOptions = {
  width: number;
  hideTitle: boolean;
  overlay: boolean;
  emoji: {
    text: string;
    animation: string;
  };
};

type TallyWindow = Window & {
  Tally?: {
    openPopup?: (formId: string, options?: TallyPopupOptions) => void;
  };
};

const AI_MATCH_TALLY_POPUP_OPTIONS: TallyPopupOptions = {
  width: 500,
  hideTitle: true,
  overlay: true,
  emoji: {
    text: "🤖",
    animation: "flash",
  },
};

export function openAiMatchTallyPopup() {
  if (typeof window === "undefined") {
    return false;
  }

  const tally = (window as TallyWindow).Tally;

  if (tally?.openPopup) {
    tally.openPopup(AI_MATCH_TALLY_FORM_ID, AI_MATCH_TALLY_POPUP_OPTIONS);
    return true;
  }

  window.location.hash = AI_MATCH_TALLY_POPUP_HREF;
  return false;
}
