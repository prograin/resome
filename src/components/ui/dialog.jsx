"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRef } from "react";
import { createIcons } from "../../local-icons";
import { Icon } from "../icon";
import { Button } from "./button";

export function DialogView({ details, dir, closeLabel, onClose, returnFocus }) {
  const closeButton = useRef(null);
  const body = useRef(null);
  return (
    <Dialog.Root
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay id="modalOverlay" className="ui-dialog__overlay">
          <Dialog.Content
            id="modalDialog"
            className={`ui-dialog${details.kind === "academy" ? " academy-neo" : ""}`}
            dir={dir}
            data-kind={details.kind}
            aria-modal="true"
            aria-describedby={undefined}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              if (details.htmlBody) createIcons(body.current);
              details.onMount?.(body.current);
              closeButton.current?.focus();
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              returnFocus();
            }}
          >
            <header className="ui-dialog__header">
              <div className="min-w-0">
                {details.kicker && <p className="ui-dialog__kicker">{details.kicker}</p>}
                <Dialog.Title className="ui-dialog__title">{details.title}</Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <Button ref={closeButton} className="ui-dialog__close" aria-label={closeLabel}>
                  <Icon name="x" />
                </Button>
              </Dialog.Close>
            </header>
            <div
              ref={body}
              id="modalBody"
              className="ui-dialog__body"
              tabIndex={0}
              role="region"
              aria-label={details.title}
            >
              {details.htmlBody ? (
                <div dangerouslySetInnerHTML={{ __html: details.htmlBody }} />
              ) : (
                details.content
              )}
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
