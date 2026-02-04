import { useState } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Logo,
  Pill,
  Radio,
  RadioGroup,
  Toast,
  ToastProvider,
  ToastViewport,
} from "./index";
import "./styles/theme.css";

function App() {
  const [openToast, setOpenToast] = useState(false);
  const InfoIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
        clipRule="evenodd"
      />
    </svg>
  );

  const SuccessIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );

  const WarningIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );

  const ErrorIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <ToastProvider>
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
              <h2 className="mb-4 font-semibold text-xl">Avatar Sizes</h2>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar
                  size={16}
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
                  fallback="16"
                />
                <Avatar
                  size={24}
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
                  fallback="24"
                />
                <Avatar
                  size={32}
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
                  fallback="32"
                />
                <Avatar
                  size={40}
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
                  fallback="40"
                />
                <Avatar
                  size={48}
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
                  fallback="48"
                />
                <Avatar
                  size={64}
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
                  fallback="64"
                />
                <Avatar
                  size={88}
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
                  fallback="88"
                />
                <Avatar
                  size={148}
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
                  fallback="148"
                />
              </div>
            </div>

            <div>
              <h2 className="mb-4 font-semibold text-xl">Avatar Variants</h2>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar
                  size={40}
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
                  fallback="JD"
                />
                <Avatar size={40} fallback="AB" />
                <Avatar
                  size={40}
                  fallback={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-6"
                      aria-hidden="true"
                    >
                      <title>Checkmark icon</title>
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>
            </div>

            <div>
              <h2 className="mb-4 font-semibold text-xl">Avatar with Online Status</h2>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar
                  size={24}
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
                  fallback="JD"
                  onlineIndicator={true}
                />
                <Avatar
                  size={32}
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
                  fallback="JD"
                  onlineIndicator={true}
                />
                <Avatar
                  size={40}
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
                  fallback="JD"
                  onlineIndicator={true}
                />
                <Avatar size={48} fallback="AB" onlineIndicator={true} />
                <Avatar size={64} fallback="AB" onlineIndicator={true} />
                <Avatar size={88} fallback="AB" onlineIndicator={true} />
              </div>
            </div>

            <div>
              <h2 className="mb-4 font-semibold text-xl">Alert Variants</h2>
              <div className="max-w-2xl space-y-4">
                <Alert variant="info" icon={InfoIcon}>
                  This is an informational alert message.
                </Alert>
                <Alert variant="success" icon={SuccessIcon}>
                  Your changes have been saved successfully.
                </Alert>
                <Alert variant="warning" icon={WarningIcon}>
                  Please review your information before proceeding.
                </Alert>
                <Alert variant="error" icon={ErrorIcon}>
                  An error occurred while processing your request.
                </Alert>
                <Alert variant="info" icon={InfoIcon} closable>
                  This is a closable info alert.
                </Alert>
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

            <div>
              <h2 className="mb-4 font-semibold text-xl">Toast Notifications</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setOpenToast(true)}
                  className="rounded-lg bg-brand-green-500 px-4 py-2 font-semibold text-body-black-solid-constant hover:bg-brand-green-500/90"
                >
                  Show Toast
                </button>
              </div>
              <Toast
                open={openToast}
                onOpenChange={setOpenToast}
                state="Success"
                title="Success!"
                description="This is a toast notification example"
              />
            </div>
          </section>
        </div>
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}

export default App;
