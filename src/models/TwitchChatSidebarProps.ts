export interface TwitchChatSidebarProps {
  channel: string
  isVisible: boolean
  onToggle: () => void
  disabled?: boolean
}
