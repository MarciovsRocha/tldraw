import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ClipboardIcon, Share1Icon } from '@radix-ui/react-icons'
import JSONCrush from 'jsoncrush'
import * as React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Alert } from '~components/Primitives/AlertDialog'
import { DMContent, DMItem, DMTriggerIcon } from '~components/Primitives/DropdownMenu'
import { SmallIcon } from '~components/Primitives/SmallIcon'
import { useTldrawApp } from '~hooks'

const ShareMenu = () => {
  const app = useTldrawApp()
  const intl = useIntl()
  const currentPageId = app.appState.currentPageId
  const pageDocument = app.document.pages[currentPageId]
  const pageState = app.document.pageStates[currentPageId]
  const [container, setContainer] = React.useState<any>(null)
  const [openDialog, setOpenDialog] = React.useState(false)

  const toggleOpenDialog = () => setOpenDialog(!openDialog)

  const copyCurrentPageLink = () => {
    const hasAsset = Object.entries(pageDocument.shapes).filter(
      ([_, value]) => value.assetId
    ).length
    if (hasAsset) {
      toggleOpenDialog()
    } else {
      try {
        const state = {
          page: {
            ...pageDocument,
          },
          pageState: {
            ...pageState,
          },
        }
        const crushed = JSONCrush.crush(JSON.stringify(state))
        const link = `${window.location.origin}/?d=${encodeURIComponent(crushed)}`
        navigator.clipboard.writeText(link)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const copyProjectLink = () => {
    if (Object.keys(app.document.assets).length) {
      toggleOpenDialog()
    } else {
      try {
        const crushed = JSONCrush.crush(JSON.stringify(app.document))
        const link = `${window.location.href}/?d=${encodeURIComponent(crushed)}`
        navigator.clipboard.writeText(link)
      } catch (e) {
        console.error(e)
      }
    }
  }

  return (
    <>
      <DropdownMenu.Root dir="ltr">
        <DMTriggerIcon id="TD-MultiplayerMenuIcon">
          <Share1Icon />
        </DMTriggerIcon>
        <DMContent
          variant="menu"
          id="TD-MultiplayerMenu"
          side="bottom"
          align="start"
          sideOffset={4}
        >
          <DMItem id="TD-Multiplayer-CopyInviteLink" onClick={copyCurrentPageLink}>
            <FormattedMessage id="copy.current.page.link" />
            <SmallIcon>
              <ClipboardIcon />
            </SmallIcon>
          </DMItem>
          <DMItem id="TD-Multiplayer-CopyReadOnlyLink" onClick={copyProjectLink}>
            <FormattedMessage id="copy.project.link" />
            <SmallIcon>
              <ClipboardIcon />
            </SmallIcon>
          </DMItem>
        </DMContent>
      </DropdownMenu.Root>
      <div ref={setContainer} />
      <Alert
        container={container}
        description={intl.formatMessage({ id: 'data.too.big.encoded' })}
        open={openDialog}
        onClose={toggleOpenDialog}
      />
    </>
  )
}

export default ShareMenu