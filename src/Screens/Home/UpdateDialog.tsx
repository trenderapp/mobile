import { Dialog, Paragraph, Portal, Button } from 'react-native-paper';
import { openURL, storeLink } from '../../Services';
import { TFunction } from 'i18next';
import React from 'react';

export default function UpdateDialog({ t }: {
    t: TFunction<"translation", undefined, "translation">
}) {
    return (
        <Portal>
          <Dialog visible={true}>
            <Dialog.Title>{t("update.title")}</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{t("update.paragraph_1")}</Paragraph>
              <Paragraph>{t("update.paragraph_2")}</Paragraph>
              <Paragraph>{t("update.paragraph_3")}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button uppercase={false} onPress={() => openURL(storeLink())}>{t("update.update")}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )
}