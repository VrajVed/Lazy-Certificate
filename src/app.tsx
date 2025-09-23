import { Button, Rows, Text } from "@canva/app-ui-kit";
import { useEffect, useState } from "react";
import type { SelectionEvent } from "@canva/design";
import { selection } from "@canva/design";
import * as styles from "styles/components.css";
import { NameList } from "../data/namelist.js";

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

    // move to next index 
    setCurrentIndex((prev) => {
      if (prev === NameList.length - 1) {
        return 0; // reset to first name
      }
      return prev + 1;
    });
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
