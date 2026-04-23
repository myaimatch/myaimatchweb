type ToolTickerProps = {
  tools?: string[];
};

const fallback = [
  "Agent builders",
  "Research workspaces",
  "AI meeting notes",
  "Prompt ops",
  "Workflow automation",
  "Knowledge bases",
  "Support assistants",
  "AI analytics",
];

export default function ToolTicker({ tools = [] }: ToolTickerProps) {
  const items = tools.length ? tools.slice(0, 10) : fallback;
  const tickerItems = [...items, ...items];

  return (
    <section className="coaching-shell pb-4 md:pb-8">
      <div className="tool-ticker" aria-label="Tool categories reviewed recently">
        <p>Recently tested</p>
        <div>
          <span>
            {tickerItems.map((item, index) => (
              <strong key={`${item}-${index}`}>{item}</strong>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}
