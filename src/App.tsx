import { Badge, Logo, Pill, Radio, RadioGroup } from "./index";
import "./styles/theme.css";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 font-bold text-3xl">fanv-ui Demo</h1>

        <section className="space-y-8">
          <div>
            <h2 className="mb-4 font-semibold text-xl">Logo Variants</h2>
            <div className="flex flex-wrap items-start gap-8">
              <div className="space-y-2">
                <p className="text-body-200 text-sm">Full Colour</p>
                <Logo type="Full" color="Full colour" />
              </div>
              <div className="space-y-2">
                <p className="text-body-200 text-sm">Icon Only</p>
                <Logo type="Icon" color="Full colour" />
              </div>
              <div className="space-y-2">
                <p className="text-body-200 text-sm">Wordmark</p>
                <Logo type="Wordmark" color="Full colour" />
              </div>
              <div className="space-y-2">
                <p className="text-body-200 text-sm">Portrait</p>
                <Logo type="Portrait" color="Full colour" />
              </div>
            </div>
            <div className="mt-6 rounded-lg bg-neutral-400 p-4">
              <div className="mb-2 text-body-300 text-sm">Dark Background</div>
              <div className="flex flex-wrap items-start gap-8">
                <Logo type="Full" color="White Always" />
                <Logo type="Icon" color="White Always" />
                <Logo type="Wordmark" color="White Always" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">Badge Types</h2>
            <div className="flex flex-wrap gap-4">
              <Badge type="Default">Default</Badge>
              <Badge type="Info">Info</Badge>
              <Badge type="Success">Success</Badge>
              <Badge type="Warning">Warning</Badge>
              <Badge type="Error">Error</Badge>
              <Badge type="Brand">Brand</Badge>
              <Badge type="Online">Online</Badge>
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">Pill Variants</h2>
            <div className="flex flex-wrap gap-4">
              <Pill variant="Green">Green</Pill>
              <Pill variant="Grey">Grey</Pill>
              <Pill variant="Blue">Blue</Pill>
              <Pill variant="Gold">Gold</Pill>
              <Pill variant="Error">Error</Pill>
              <Pill variant="Brand">Brand</Pill>
              <Pill variant="Beta">Beta</Pill>
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-xl">Radio Group</h2>
            <RadioGroup defaultValue="option1">
              <div className="flex flex-col gap-4">
                <Radio label="Option 1" value="option1" helperText="This is the first option" />
                <Radio label="Option 2" value="option2" helperText="This is the second option" />
                <Radio label="Option 3" value="option3" />
              </div>
            </RadioGroup>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
