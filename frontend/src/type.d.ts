type ReturnedData = {
  intro_story: string;
  option_a: string;
  option_b: string;
  is_end?: boolean;
};

type StoryData = {
  country: string;
  city: string;
  companion: string;
  budget: string;
  duration: string;
  relationShipDynamics: string | null;
  adventuresStyle: string | null;
  tone: string | null;
  conflict: string | null;
};

type ChatMessage = {
  role: string;
  content: string | ReturnedData;
};
