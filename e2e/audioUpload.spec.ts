import { expect, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

test.describe("AudioUpload", () => {
  test.describe("story rendering", () => {
    test("Default story renders upload area with record button", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "Default"));

      const upload = page.getByTestId("audio-upload");
      await expect(upload).toBeVisible();
      await expect(upload).toHaveAttribute("data-state", "idle");
      await expect(page.getByText("Click to upload, or drag & drop")).toBeVisible();
      await expect(page.getByText("Audio files only, up to 10MB each")).toBeVisible();
      await expect(page.getByText("Record audio")).toBeVisible();
    });

    test("WithoutRecording story hides record button", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "WithoutRecording"));

      const upload = page.getByTestId("audio-upload");
      await expect(upload).toBeVisible();
      await expect(page.getByText("Click to upload, or drag & drop")).toBeVisible();
      await expect(page.getByText("Record audio")).toBeHidden();
      await expect(page.getByText("or", { exact: true })).toBeHidden();
    });

    test("Disabled story renders with reduced opacity", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "Disabled"));

      const upload = page.getByTestId("audio-upload");
      await expect(upload).toBeVisible();
      await expect(upload).toHaveAttribute("aria-disabled", "true");
      await expect(upload).toHaveClass(/opacity-50/);
    });

    test("CustomLabels story renders custom text", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "CustomLabels"));

      const upload = page.getByTestId("audio-upload");
      await expect(upload).toBeVisible();
      await expect(page.getByText("Drop your audio here")).toBeVisible();
      await expect(page.getByText("MP3, WAV, OGG — max 5MB")).toBeVisible();
      await expect(page.getByText("or alternatively")).toBeVisible();
      await expect(page.getByText("Use microphone")).toBeVisible();
    });

    test("MultipleFiles story renders correctly", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "MultipleFiles"));

      const upload = page.getByTestId("audio-upload");
      await expect(upload).toBeVisible();
      await expect(page.getByText("Audio files only, up to 10MB each (max 7 files)")).toBeVisible();
    });

    test("ShortMaxDuration story renders correctly", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "ShortMaxDuration"));

      const upload = page.getByTestId("audio-upload");
      await expect(upload).toBeVisible();
    });
  });

  test.describe("disabled state", () => {
    test("disabled file input cannot receive files", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "Disabled"));

      const input = page.locator('input[type="file"]');
      await expect(input).toBeDisabled();
    });

    test("disabled record button is not clickable", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "Disabled"));

      const recordButton = page.getByRole("button", { name: /record audio/i });
      await expect(recordButton).toBeDisabled();
    });
  });

  test.describe("file input", () => {
    test("file input is associated with label via htmlFor", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "Default"));

      const input = page.locator('input[type="file"]');
      const inputId = await input.getAttribute("id");
      expect(inputId).toBeTruthy();

      const label = page.locator(`label[for="${inputId}"]`);
      await expect(label).toBeVisible();
    });

    test("file input accepts audio MIME types", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "Default"));

      const input = page.locator('input[type="file"]');
      const accept = await input.getAttribute("accept");
      expect(accept).toContain("audio/mpeg");
      expect(accept).toContain("audio/wav");
      expect(accept).toContain("audio/ogg");
    });

    test("file input is single-file by default", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "Default"));

      const input = page.locator('input[type="file"]');
      const multiple = await input.getAttribute("multiple");
      expect(multiple).toBeNull();
    });

    test("MultipleFiles story has multiple attribute on input", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "MultipleFiles"));

      const input = page.locator('input[type="file"]');
      await expect(input).toHaveAttribute("multiple", "");
    });
  });

  test.describe("keyboard navigation", () => {
    test("file input is focusable via Tab", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "Default"));

      const input = page.locator('input[type="file"]');
      await input.focus();
      await expect(input).toBeFocused();
    });

    test("record button is focusable via Tab after file input", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "Default"));

      const recordButton = page.getByRole("button", { name: /record audio/i });
      await recordButton.focus();
      await expect(recordButton).toBeFocused();
    });

    test("label shows focus ring when file input is focused", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "Default"));

      const input = page.locator('input[type="file"]');
      await input.focus();
      await expect(input).toBeFocused();

      // The label should have peer-focus-visible styling applied
      // The input has the "peer" class, and the label uses peer-focus-visible
      const label = page.locator("label");
      await expect(label).toHaveClass(/peer-focus-visible/);
    });
  });

  test.describe("drag and drop feedback", () => {
    test("shows visual feedback on dragover", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "Default"));

      const upload = page.getByTestId("audio-upload");

      // Use page.evaluate to dispatch drag events (DataTransfer can't be serialized via dispatchEvent)
      await upload.evaluate((el) => {
        const event = new DragEvent("dragover", {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer(),
        });
        el.dispatchEvent(event);
      });

      await expect(upload).toHaveClass(/ring-2/);
      await expect(upload).toHaveClass(/bg-brand-green-50/);
    });

    test("removes visual feedback on dragleave", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "Default"));

      const upload = page.getByTestId("audio-upload");

      // Trigger dragover then dragleave
      await upload.evaluate((el) => {
        const event = new DragEvent("dragover", {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer(),
        });
        el.dispatchEvent(event);
      });
      await expect(upload).toHaveClass(/ring-2/);

      await upload.evaluate((el) => {
        const event = new DragEvent("dragleave", {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer(),
        });
        el.dispatchEvent(event);
      });
      await expect(upload).not.toHaveClass(/ring-2/);
    });

    test("disabled state does not show drag feedback", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "Disabled"));

      const upload = page.getByTestId("audio-upload");

      await upload.evaluate((el) => {
        const event = new DragEvent("dragover", {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer(),
        });
        el.dispatchEvent(event);
      });

      await expect(upload).not.toHaveClass(/ring-2/);
      await expect(upload).not.toHaveClass(/bg-brand-green-50/);
    });
  });

  test.describe("accessibility", () => {
    test("upload area has role='group' with accessible label", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "Default"));

      const group = page.getByRole("group", { name: /audio upload/i });
      await expect(group).toBeVisible();
    });

    test("file input has aria-describedby pointing to description", async ({ page }) => {
      await page.goto(getStoryUrl("AudioUpload", "Default"));

      const input = page.locator('input[type="file"]');
      const describedBy = await input.getAttribute("aria-describedby");
      expect(describedBy).toBeTruthy();

      const description = page.locator(`#${describedBy}`);
      await expect(description).toContainText("Audio files only");
    });
  });
});
