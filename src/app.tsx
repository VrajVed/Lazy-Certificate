import { Button, Rows, Text } from "@canva/app-ui-kit";
import { useEffect, useState } from "react";
import type { SelectionEvent } from "@canva/design";
import { selection, requestExport } from "@canva/design";
import * as styles from "styles/components.css";
import NameList from "../data/namelist.json" assert { type: "json" };

export const App = () => {
  

  const [selectionState, setSelectionState] = useState<SelectionEvent<"richtext">>({
    count: 0,
    scope: "richtext",
    read: () =>
      Promise.resolve({
        contents: [],
        save: () => Promise.resolve(),
      }),
  });

  // this will track the current index
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    selection.registerOnChange({
      scope: "richtext",
      onChange: (evt) => {
        if (evt.count > 0) {
          setSelectionState(evt);
        }
      },
    });
  }, []);

  const replaceText = async () => {
    if (!selectionState) return;

    console.log("🔄 Starting text replacement...");
    console.log("📝 Current name:", NameList[currentIndex]);

    const draft = await selectionState.read();

    for (const richtext of draft.contents) {
      const plaintext = await richtext.readPlaintext();

      richtext.replaceText(
        { index: 0, length: plaintext.length },
        NameList[currentIndex],
        { decoration: "none" }
      );
    }

    await draft.save();
    console.log("✅ Text replaced with:", NameList[currentIndex]);

    // move to next index 
    setCurrentIndex((prev) => {
      const nextIndex = prev === NameList.length - 1 ? 0 : prev + 1;
      console.log("➡️ Next index will be:", nextIndex, "(" + NameList[nextIndex] + ")");
      return nextIndex;
    });
    
    console.log("📤 Requesting export...");
    const result = await requestExport({
      acceptedFileTypes: ["png"]
    });

    if (result.status === "completed") {
      // This gives you a download URL
      const url = result.exportBlobs[0].url;
      const name = NameList[currentIndex];

      console.log("✅ Export completed!");
      console.log("🔗 Export URL:", url);
      console.log("💾 Saving as:", name + ".png");

      fetch("http://localhost:3000/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, name }),
      })
        .then((res) => res.json())
        .then((data) => console.log("✅ Server response:", data))
        .catch((err) => console.error("❌ Server error:", err));
    }
      else {
        console.error("❌ Export failed or was cancelled:", result);
      } 
    /*// force download in browser
      const link = document.createElement("a");
      link.href = url;
      link.download = "design.png";
      document.body.appendChild(link);
      link.click();
      link.remove();*/ 

  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can replace the selected text.
          Select a text in the editor to begin.
        </Text>
        <Button
          variant="primary"
          onClick={replaceText}
          disabled={selectionState.count === 0}
        >
          Replace with Next value
        </Button>
      </Rows>
    </div>
  );
};
